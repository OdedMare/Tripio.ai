import json

from backend.dal import gmail_client, token_store
from backend.dal.agents.trip_lookup_agent import TripLookupAgent
from backend.models.gmail import DetectedTrip

_trip_lookup_agent = TripLookupAgent()


def is_connected() -> bool:
    return token_store.is_connected()


def _build_user_prompt(emails: list[dict]) -> str:
    return (
        "Here are candidate emails from a travel-keyword search of the user's inbox:\n\n"
        f"{json.dumps(emails, indent=2)}\n\n"
        "Extract the real trips from this list."
    )


async def find_recent_trips() -> list[DetectedTrip]:
    credentials = token_store.get_credentials()
    if not credentials:
        raise RuntimeError("Gmail is not connected")

    emails = gmail_client.search_trip_emails(credentials)
    if not emails:
        return []

    result = await _trip_lookup_agent.run(_build_user_prompt(emails))
    return result.trips
