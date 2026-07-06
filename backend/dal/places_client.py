import os

import requests

PLACES_SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete"

FIELD_MASK = ",".join(
    [
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.priceLevel",
        "places.location",
        "places.types",
        "places.editorialSummary",
        "places.googleMapsUri",
        "places.websiteUri",
    ]
)


def is_configured() -> bool:
    return bool(os.environ.get("GOOGLE_PLACES_API_KEY"))


def search_hotels(destination: str, max_results: int = 6) -> list[dict]:
    """Text-search Places API (New) for lodging in the given destination."""
    response = requests.post(
        PLACES_SEARCH_TEXT_URL,
        json={
            "textQuery": f"hotels in {destination}",
            "includedType": "lodging",
            "maxResultCount": max_results,
        },
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ["GOOGLE_PLACES_API_KEY"],
            "X-Goog-FieldMask": FIELD_MASK,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("places", [])


def autocomplete_places(query: str, max_results: int = 6) -> list[dict]:
    """Suggest cities/airports/regions matching the query, via Places API (New) autocomplete."""
    response = requests.post(
        PLACES_AUTOCOMPLETE_URL,
        json={
            "input": query,
            "includedPrimaryTypes": ["locality", "airport", "administrative_area_level_1", "country"],
        },
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ["GOOGLE_PLACES_API_KEY"],
        },
        timeout=10,
    )
    response.raise_for_status()
    suggestions = response.json().get("suggestions", [])

    results = []
    for suggestion in suggestions[:max_results]:
        prediction = suggestion.get("placePrediction")
        if not prediction:
            continue
        results.append(
            {
                "placeId": prediction.get("placeId"),
                "text": prediction.get("text", {}).get("text", ""),
            }
        )
    return results


def search_attractions(destination: str, max_results: int = 8) -> list[dict]:
    """Text-search Places API (New) for attractions in the given destination."""
    response = requests.post(
        PLACES_SEARCH_TEXT_URL,
        json={
            "textQuery": f"tourist attractions in {destination}",
            "includedType": "tourist_attraction",
            "maxResultCount": max_results,
        },
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ["GOOGLE_PLACES_API_KEY"],
            "X-Goog-FieldMask": FIELD_MASK,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("places", [])


def search_restaurants(destination: str, max_results: int = 8) -> list[dict]:
    """Text-search Places API (New) for restaurants in the given destination."""
    response = requests.post(
        PLACES_SEARCH_TEXT_URL,
        json={
            "textQuery": f"restaurants in {destination}",
            "includedType": "restaurant",
            "maxResultCount": max_results,
        },
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.environ["GOOGLE_PLACES_API_KEY"],
            "X-Goog-FieldMask": FIELD_MASK,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("places", [])
