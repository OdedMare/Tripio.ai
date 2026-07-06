from fastapi import APIRouter, Query

from backend.dal import places_client
from backend.models.places import PlaceSuggestion

router = APIRouter(prefix="/places", tags=["places"])


@router.get("/autocomplete", response_model=list[PlaceSuggestion])
def autocomplete(query: str = Query(min_length=1)) -> list[PlaceSuggestion]:
    if not places_client.is_configured():
        return []
    suggestions = places_client.autocomplete_places(query)
    return [PlaceSuggestion(placeId=item["placeId"], text=item["text"]) for item in suggestions]
