import json
import re

from backend.dal import gmail_client, token_store
from backend.dal.agents.trip_lookup_agent import TripLookupAgent
from backend.models.gmail import DetectedTrip

_trip_lookup_agent = TripLookupAgent()

# Invisible Unicode formatting characters (word joiners, zero-width spaces,
# bidi control marks) sometimes survive in email subject/body text and end
# up echoed back verbatim by the extraction agent. They render as stray
# glyphs/kerning artifacts in the UI, so strip them before returning results.
# Ranges: U+200B-U+200F (zero-width space/joiners, LTR/RTL marks),
# U+202A-U+202E (bidi embedding/override), U+2060-U+2064 (word joiner and
# invisible math operators), U+FEFF (BOM / zero-width no-break space).
_INVISIBLE_FORMATTING_CHARS = re.compile(
    "[​-\u200F\u202A-\u202E⁠-⁤﻿]"
)


def _clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    return _INVISIBLE_FORMATTING_CHARS.sub("", value).strip()


def _clean_trip(trip: DetectedTrip) -> DetectedTrip:
    return trip.model_copy(
        update={
            "destination": _clean_text(trip.destination),
            "dates": _clean_text(trip.dates),
            "sourceSubject": _clean_text(trip.sourceSubject) or trip.sourceSubject,
        }
    )


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
    return [_clean_trip(trip) for trip in result.trips]
