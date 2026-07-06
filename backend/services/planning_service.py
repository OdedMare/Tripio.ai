import json
from typing import AsyncIterator

from backend.dal import places_client
from backend.dal.agents.attractions_agent import AttractionsAgent
from backend.dal.agents.hotel_agent import HotelAgent
from backend.dal.agents.planner_agent import PlannerAgent
from backend.models.diagnosis import TravelDiagnosisProfile
from backend.models.planning import (
    AttractionSuggestion,
    FlightSuggestion,
    HotelSuggestion,
    TripPlan,
)

_planner_agent = PlannerAgent()
_hotel_agent = HotelAgent()
_attractions_agent = AttractionsAgent()


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


async def suggest_flights(destination: str, profile: TravelDiagnosisProfile) -> list[FlightSuggestion]:
    prompt = (
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Suggest flight options for this trip."
    )
    result = await _planner_agent.run(prompt)
    return result.flights


async def suggest_hotels(destination: str, profile: TravelDiagnosisProfile) -> list[HotelSuggestion]:
    real_hotels = _extract_places_hotels(destination)
    real_hotels_block = (
        f"\n\nReal candidate hotels found via Google Places:\n{json.dumps(real_hotels, indent=2)}"
        if real_hotels
        else "\n\nNo real hotel data available — suggest realistic options and mark them as AI-suggested."
    )

    prompt = (
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}"
        f"{real_hotels_block}\n\n"
        "Pick and describe the hotels that best fit this traveler."
    )
    result = await _hotel_agent.run(prompt)

    source = "google-places" if real_hotels else "ai-suggested"
    return [hotel.model_copy(update={"source": hotel.source or source}) for hotel in result.hotels]


async def suggest_attractions(destination: str, profile: TravelDiagnosisProfile) -> list[AttractionSuggestion]:
    prompt = (
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Suggest attractions and experiences for this trip."
    )
    result = await _attractions_agent.run(prompt)
    return result.attractions


def _build_summary(destination: str, profile: TravelDiagnosisProfile) -> str:
    traveler_label = profile.travelerType.replace("-", " ")
    return f"A {profile.pace}-paced trip to {destination}, tailored for a {traveler_label} with {profile.comfortLevel} comfort expectations."


async def build_trip_plan(
    destination: str,
    dates: str | None,
    profile: TravelDiagnosisProfile,
    include_flights: bool,
) -> TripPlan:
    flights: list[FlightSuggestion] = []
    if include_flights:
        flights = await suggest_flights(destination, profile)

    hotels = await suggest_hotels(destination, profile)
    attractions = await suggest_attractions(destination, profile)

    return TripPlan(
        destination=destination,
        dates=dates,
        summary=_build_summary(destination, profile),
        flights=flights,
        hotels=hotels,
        attractions=attractions,
    )


async def stream_trip_plan(
    destination: str,
    dates: str | None,
    profile: TravelDiagnosisProfile,
    include_flights: bool,
) -> AsyncIterator[dict]:
    """Build a trip plan step by step, yielding one event per agent stage so
    the caller can show the user which agent is running, what model it used,
    and its raw response as it happens."""

    flights: list[FlightSuggestion] = []

    if include_flights:
        yield {"type": "stage-start", "agent": "planner", "label": "Planner agent is finding flights..."}
        prompt = (
            f"Destination: {destination}\n\n"
            f"Traveler profile:\n{_profile_summary(profile)}\n\n"
            "Suggest flight options for this trip."
        )
        trace = await _planner_agent.run_traced(prompt)
        flights = trace.output.flights
        yield {
            "type": "stage-done",
            "agent": "planner",
            "model": trace.model,
            "response": trace.raw_response,
        }

    yield {"type": "stage-start", "agent": "hotel", "label": "Hotel agent is searching Google Places..."}
    real_hotels = _extract_places_hotels(destination)
    real_hotels_block = (
        f"\n\nReal candidate hotels found via Google Places:\n{json.dumps(real_hotels, indent=2)}"
        if real_hotels
        else "\n\nNo real hotel data available — suggest realistic options and mark them as AI-suggested."
    )
    hotel_prompt = (
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}"
        f"{real_hotels_block}\n\n"
        "Pick and describe the hotels that best fit this traveler."
    )
    hotel_trace = await _hotel_agent.run_traced(hotel_prompt)
    source = "google-places" if real_hotels else "ai-suggested"
    hotels = [hotel.model_copy(update={"source": hotel.source or source}) for hotel in hotel_trace.output.hotels]
    yield {
        "type": "stage-done",
        "agent": "hotel",
        "model": hotel_trace.model,
        "response": hotel_trace.raw_response,
    }

    yield {"type": "stage-start", "agent": "attractions", "label": "Attractions agent is searching the web..."}
    attractions_prompt = (
        f"Destination: {destination}\n\n"
        f"Traveler profile:\n{_profile_summary(profile)}\n\n"
        "Suggest attractions and experiences for this trip."
    )
    attractions_trace = await _attractions_agent.run_traced(attractions_prompt)
    attractions = attractions_trace.output.attractions
    yield {
        "type": "stage-done",
        "agent": "attractions",
        "model": attractions_trace.model,
        "response": attractions_trace.raw_response,
    }

    plan = TripPlan(
        destination=destination,
        dates=dates,
        summary=_build_summary(destination, profile),
        flights=flights,
        hotels=hotels,
        attractions=attractions,
    )
    yield {"type": "complete", "plan": plan.model_dump()}
