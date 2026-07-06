from fastapi import APIRouter, Query

from backend.dal import places_client
from backend.models.places import PlaceSuggestion, PlaceDetail

router = APIRouter(prefix="/places", tags=["places"])


@router.get("/autocomplete", response_model=list[PlaceSuggestion])
def autocomplete(query: str = Query(min_length=1)) -> list[PlaceSuggestion]:
    if not places_client.is_configured():
        return []
    suggestions = places_client.autocomplete_places(query)
    return [PlaceSuggestion(placeId=item["placeId"], text=item["text"]) for item in suggestions]


@router.get("/attractions", response_model=list[PlaceDetail])
def get_attractions(destination: str = Query(min_length=1)) -> list[PlaceDetail]:
    if not places_client.is_configured():
        return []
    raw_places = places_client.search_attractions(destination)
    results = []
    for p in raw_places:
        loc = p.get("location", {})
        results.append(
            PlaceDetail(
                name=p.get("displayName", {}).get("text", "Unknown"),
                location=p.get("formattedAddress", ""),
                rating=p.get("rating", 4.0),
                priceLevel=p.get("priceLevel"),
                latitude=loc.get("latitude"),
                longitude=loc.get("longitude"),
                summary=p.get("editorialSummary", {}).get("text"),
                googleMapsUri=p.get("googleMapsUri"),
                websiteUri=p.get("websiteUri"),
                types=p.get("types", []),
            )
        )
    return results


@router.get("/restaurants", response_model=list[PlaceDetail])
def get_restaurants(destination: str = Query(min_length=1)) -> list[PlaceDetail]:
    if not places_client.is_configured():
        return []
    raw_places = places_client.search_restaurants(destination)
    results = []
    for p in raw_places:
        loc = p.get("location", {})
        results.append(
            PlaceDetail(
                name=p.get("displayName", {}).get("text", "Unknown"),
                location=p.get("formattedAddress", ""),
                rating=p.get("rating", 4.0),
                priceLevel=p.get("priceLevel"),
                latitude=loc.get("latitude"),
                longitude=loc.get("longitude"),
                summary=p.get("editorialSummary", {}).get("text"),
                googleMapsUri=p.get("googleMapsUri"),
                websiteUri=p.get("websiteUri"),
                types=p.get("types", []),
            )
        )
    return results
