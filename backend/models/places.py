from pydantic import BaseModel


class PlaceSuggestion(BaseModel):
    placeId: str
    text: str
