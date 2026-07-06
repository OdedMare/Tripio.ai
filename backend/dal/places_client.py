import os

import requests

PLACES_SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText"

FIELD_MASK = ",".join(
    [
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.priceLevel",
        "places.location",
        "places.types",
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
