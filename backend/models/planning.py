from typing import Literal, Optional

from pydantic import BaseModel

from backend.models.diagnosis import TravelDiagnosisProfile


class PlanTripRequest(BaseModel):
    destination: str
    origin: Optional[str] = None
    dates: Optional[str] = None
    totalDays: Optional[int] = None
    profile: TravelDiagnosisProfile
    includeFlights: bool = True


class FlightSuggestion(BaseModel):
    airline: str
    route: str
    estimatedPriceRange: str
    duration: str
    stops: str
    note: str = "AI-estimated — not a live fare."
    googleFlightsUrl: Optional[str] = None
    skyscannerUrl: Optional[str] = None


class HotelSuggestion(BaseModel):
    name: str
    area: str
    rating: float
    priceRange: str
    amenities: list[str]
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source: Literal["google-places", "ai-suggested"] = "ai-suggested"
    bookingUrl: Optional[str] = None


class AttractionSuggestion(BaseModel):
    name: str
    category: str
    description: str
    estimatedVisitDuration: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class RestaurantSuggestion(BaseModel):
    name: str
    area: str
    cuisine: str
    label: str = ""
    summary: str = ""
    rating: float
    priceRange: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source: Literal["google-places", "ai-suggested"] = "ai-suggested"


class TransportLeg(BaseModel):
    mode: str
    duration: str
    notes: str = "AI-estimated from general route knowledge — not a live schedule."


class ItineraryLeg(BaseModel):
    city: str
    days: int
    startDay: int
    endDay: int
    transportFromPrevious: Optional[TransportLeg] = None


class CityPlan(BaseModel):
    city: str
    days: int
    startDay: int
    endDay: int
    transportFromPrevious: Optional[TransportLeg] = None
    hotels: list[HotelSuggestion]
    attractions: list[AttractionSuggestion]
    restaurants: list[RestaurantSuggestion]


class TripPlan(BaseModel):
    destination: str
    dates: Optional[str]
    totalDays: Optional[int] = None
    summary: str
    flights: list[FlightSuggestion]
    itinerary: list[CityPlan]
    hotels: list[HotelSuggestion]
    attractions: list[AttractionSuggestion]
    restaurants: list[RestaurantSuggestion]


class HotelSearchRequest(BaseModel):
    destination: str
    profile: TravelDiagnosisProfile


class AttractionsSearchRequest(BaseModel):
    destination: str
    profile: TravelDiagnosisProfile


class GeneratedHotels(BaseModel):
    hotels: list[HotelSuggestion]


class GeneratedAttractions(BaseModel):
    attractions: list[AttractionSuggestion]


class GeneratedRestaurants(BaseModel):
    restaurants: list[RestaurantSuggestion]


class GeneratedFlights(BaseModel):
    flights: list[FlightSuggestion]


class GeneratedItinerary(BaseModel):
    legs: list[ItineraryLeg]


class RefineDayRequest(BaseModel):
    city: str
    dayNumber: int
    instruction: str
    attractions: list[AttractionSuggestion] = []
    restaurants: list[RestaurantSuggestion] = []


class RefinedDayPlan(BaseModel):
    changeSummary: str
    attractions: list[AttractionSuggestion]
    restaurants: list[RestaurantSuggestion]
