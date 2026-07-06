from typing import Literal, Optional

from pydantic import BaseModel

from backend.models.diagnosis import TravelDiagnosisProfile


class PlanTripRequest(BaseModel):
    destination: str
    dates: Optional[str] = None
    profile: TravelDiagnosisProfile
    includeFlights: bool = True


class FlightSuggestion(BaseModel):
    airline: str
    route: str
    estimatedPriceRange: str
    duration: str
    stops: str
    note: str = "AI-estimated — not a live fare."


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


class AttractionSuggestion(BaseModel):
    name: str
    category: str
    description: str
    estimatedVisitDuration: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class TripPlan(BaseModel):
    destination: str
    dates: Optional[str]
    summary: str
    flights: list[FlightSuggestion]
    hotels: list[HotelSuggestion]
    attractions: list[AttractionSuggestion]


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


class GeneratedFlights(BaseModel):
    flights: list[FlightSuggestion]
