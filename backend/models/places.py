from typing import Optional, List
from pydantic import BaseModel


class PlaceSuggestion(BaseModel):
    placeId: str
    text: str


class PlaceDetail(BaseModel):
    name: str
    location: str
    rating: float
    priceLevel: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    summary: Optional[str] = None
    googleMapsUri: Optional[str] = None
    websiteUri: Optional[str] = None
    types: List[str] = []
