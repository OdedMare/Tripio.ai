from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TRIP_SEARCH_QUERY = (
    "subject:(confirmation OR itinerary OR booking OR reservation OR ticket) "
    "(from:booking.com OR from:airbnb.com OR from:expedia.com OR from:hotels.com "
    "OR subject:flight OR subject:hotel OR subject:reservation)"
)

MAX_RESULTS = 10


def _get_header(headers: list[dict], name: str) -> str | None:
    return next((h["value"] for h in headers if h["name"].lower() == name.lower()), None)


def search_trip_emails(credentials: Credentials, max_results: int = MAX_RESULTS) -> list[dict]:
    """Returns a list of {id, subject, from, date, snippet} for likely trip-related emails."""
    service = build("gmail", "v1", credentials=credentials)

    results = (
        service.users()
        .messages()
        .list(userId="me", q=TRIP_SEARCH_QUERY, maxResults=max_results)
        .execute()
    )
    message_refs = results.get("messages", [])

    emails = []
    for ref in message_refs:
        message = (
            service.users()
            .messages()
            .get(userId="me", id=ref["id"], format="metadata", metadataHeaders=["Subject", "From", "Date"])
            .execute()
        )
        headers = message.get("payload", {}).get("headers", [])
        emails.append(
            {
                "id": message["id"],
                "subject": _get_header(headers, "Subject") or "(no subject)",
                "from": _get_header(headers, "From") or "(unknown sender)",
                "date": _get_header(headers, "Date") or "",
                "snippet": message.get("snippet", ""),
            }
        )

    return emails
