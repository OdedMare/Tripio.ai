import json
from typing import AsyncIterator

from backend.dal import places_client
from backend.dal.agents.attractions_agent import AttractionsAgent
from backend.dal.agents.hotel_agent import HotelAgent
from backend.dal.agents.itinerary_agent import ItineraryAgent
from backend.dal.agents.planner_agent import PlannerAgent
from backend.models.diagnosis import TravelDiagnosisProfile
from backend.models.planning import (
    AttractionSuggestion,
    CityPlan,
    FlightSuggestion,
    HotelSuggestion,
    ItineraryLeg,
    TripPlan,
)

_planner_agent = PlannerAgent()
_hotel_agent = HotelAgent()
_attractions_agent = AttractionsAgent()
_itinerary_agent = ItineraryAgent()

DEFAULT_TRIP_DAYS = 7


def _profile_summary(profile: TravelDiagnosisProfile) -> str:
    return (
        f"Traveler type: {profile.travelerType}\n"
        f"Pace: {profile.pace}\n"
        f"Comfort level: {profile.comfortLevel}\n"
        f"Budget: {profile.preferredBudget}\n"
        f"Planning style: {profile.planningStyle}\n"
        f"Hotel style: {profile.hotelStyle}\n"
        f"Food style: {profile.foodStyle}\n"
        f"Transport style: {profile.transportStyle}\n"
        f"Interests: {', '.join(profile.interests) or 'none stated'}\n"
        f"Dealbreakers: {', '.join(profile.dealbreakers) or 'none stated'}"
    )


def _extract_places_hotels(destination: str) -> list[dict]:
    if not places_client.is_configured():
        return []
    try:
        raw_places = places_client.search_hotels(destination)
    except Exception:
        return []

    hotels = []
    for place in raw_places:
        location = place.get("location", {})
        hotels.append(
            {
                "name": place.get("displayName", {}).get("text", "Unknown hotel"),
                "area": place.get("formattedAddress", destination),
                "rating": place.get("rating", 4.0),
                "latitude": location.get("latitude"),
                "longitude": location.get("longitude"),
            }
        )
    return hotels


def _flight_prompt(destination: str, origin: str | None, profile: TravelDiagnosisProfile) -> str:
    origin_line = f"Departure city: {origin}\n" if origin else "Departure city: not specified — assume a major international hub.\n"
    return (
        f"{origin_line}"
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Suggest flight options for this trip."
    )


def _itinerary_prompt(destination: str, total_days: int, profile: TravelDiagnosisProfile) -> str:
    return (
        f"Destination: {destination}\n"
        f"Total trip length: {total_days} days\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Plan the multi-city (or single-city) itinerary for this trip."
    )


def _hotel_prompt(city: str, profile: TravelDiagnosisProfile, real_hotels: list[dict]) -> str:
    real_hotels_block = (
        f"\n\nReal candidate hotels found via Google Places:\n{json.dumps(real_hotels, indent=2)}"
        if real_hotels
        else "\n\nNo real hotel data available — suggest realistic options and mark them as AI-suggested."
    )
    return (
        f"Destination: {city}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}"
        f"{real_hotels_block}\n\n"
        "Pick and describe the hotels that best fit this traveler."
    )


def _attractions_prompt(city: str, days: int, profile: TravelDiagnosisProfile) -> str:
    return (
        f"Destination: {city}\n"
        f"Time available in this city: {days} day(s)\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Suggest attractions and experiences for this leg of the trip, sized to fit the "
        "available time (roughly 2-3 per day for a balanced pace)."
    )


async def suggest_flights(destination: str, profile: TravelDiagnosisProfile, origin: str | None = None) -> list[FlightSuggestion]:
    result = await _planner_agent.run(_flight_prompt(destination, origin, profile))
    return result.flights


async def suggest_hotels(destination: str, profile: TravelDiagnosisProfile) -> list[HotelSuggestion]:
    real_hotels = _extract_places_hotels(destination)
    result = await _hotel_agent.run(_hotel_prompt(destination, profile, real_hotels))
    source = "google-places" if real_hotels else "ai-suggested"
    return [hotel.model_copy(update={"source": hotel.source or source}) for hotel in result.hotels]


async def suggest_attractions(destination: str, profile: TravelDiagnosisProfile) -> list[AttractionSuggestion]:
    result = await _attractions_agent.run(_attractions_prompt(destination, DEFAULT_TRIP_DAYS, profile))
    return result.attractions


def _build_summary(destination: str, profile: TravelDiagnosisProfile, itinerary: list[ItineraryLeg]) -> str:
    traveler_label = profile.travelerType.replace("-", " ")
    if len(itinerary) > 1:
        route = " → ".join(f"{leg.city} ({leg.days}d)" for leg in itinerary)
        return f"A {profile.pace}-paced trip through {destination}: {route}, tailored for a {traveler_label} with {profile.comfortLevel} comfort expectations."
    return f"A {profile.pace}-paced trip to {destination}, tailored for a {traveler_label} with {profile.comfortLevel} comfort expectations."


async def build_trip_plan(
    destination: str,
    dates: str | None,
    profile: TravelDiagnosisProfile,
    include_flights: bool,
    origin: str | None = None,
    total_days: int | None = None,
) -> TripPlan:
    plan: TripPlan | None = None
    async for event in stream_trip_plan(destination, dates, profile, include_flights, origin, total_days):
        if event["type"] == "complete":
            plan = TripPlan(**event["plan"])
    assert plan is not None
    return plan


async def stream_trip_plan(
    destination: str,
    dates: str | None,
    profile: TravelDiagnosisProfile,
    include_flights: bool,
    origin: str | None = None,
    total_days: int | None = None,
) -> AsyncIterator[dict]:
    """Build a trip plan step by step, yielding one event per agent stage so
    the caller can show the user which agent is running, what model it used,
    and its raw response as it happens."""

    days = total_days or DEFAULT_TRIP_DAYS

    flights: list[FlightSuggestion] = []
    if include_flights:
        yield {"type": "stage-start", "agent": "planner", "label": "Planner agent is finding flights..."}
        trace = await _planner_agent.run_traced(_flight_prompt(destination, origin, profile))
        flights = trace.output.flights
        yield {
            "type": "stage-done",
            "agent": "planner",
            "model": trace.model,
            "response": trace.raw_response,
        }

    yield {"type": "stage-start", "agent": "itinerary", "label": "Itinerary agent is planning your route..."}
    itinerary_trace = await _itinerary_agent.run_traced(_itinerary_prompt(destination, days, profile))
    legs = itinerary_trace.output.legs
    yield {
        "type": "stage-done",
        "agent": "itinerary",
        "model": itinerary_trace.model,
        "response": itinerary_trace.raw_response,
    }

    city_plans: list[CityPlan] = []
    all_hotels: list[HotelSuggestion] = []
    all_attractions: list[AttractionSuggestion] = []

    for leg in legs:
        yield {"type": "stage-start", "agent": "hotel", "leg": leg.city, "label": f"Hotel agent is searching {leg.city}..."}
        real_hotels = _extract_places_hotels(leg.city)
        hotel_trace = await _hotel_agent.run_traced(_hotel_prompt(leg.city, profile, real_hotels))
        source = "google-places" if real_hotels else "ai-suggested"
        leg_hotels = [hotel.model_copy(update={"source": hotel.source or source}) for hotel in hotel_trace.output.hotels]
        all_hotels.extend(leg_hotels)
        yield {
            "type": "stage-done",
            "agent": "hotel",
            "leg": leg.city,
            "model": hotel_trace.model,
            "response": hotel_trace.raw_response,
        }

        yield {"type": "stage-start", "agent": "attractions", "leg": leg.city, "label": f"Attractions agent is searching {leg.city}..."}
        attractions_trace = await _attractions_agent.run_traced(_attractions_prompt(leg.city, leg.days, profile))
        leg_attractions = attractions_trace.output.attractions
        all_attractions.extend(leg_attractions)
        yield {
            "type": "stage-done",
            "agent": "attractions",
            "leg": leg.city,
            "model": attractions_trace.model,
            "response": attractions_trace.raw_response,
        }

        city_plans.append(
            CityPlan(
                city=leg.city,
                days=leg.days,
                startDay=leg.startDay,
                endDay=leg.endDay,
                transportFromPrevious=leg.transportFromPrevious,
                hotels=leg_hotels,
                attractions=leg_attractions,
            )
        )

    plan = TripPlan(
        destination=destination,
        dates=dates,
        totalDays=days,
        summary=_build_summary(destination, profile, legs),
        flights=flights,
        itinerary=city_plans,
        hotels=all_hotels,
        attractions=all_attractions,
    )
    yield {"type": "complete", "plan": plan.model_dump()}
