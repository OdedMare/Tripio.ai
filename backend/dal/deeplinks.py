from datetime import date
from urllib.parse import quote, urlencode

GOOGLE_FLIGHTS_URL = "https://www.google.com/travel/flights"
SKYSCANNER_SEARCH_URL = "https://www.skyscanner.net/transport/flights"
BOOKING_SEARCH_URL = "https://www.booking.com/searchresults.html"


def google_flights_url(origin: str | None, destination: str, depart_date: date | None = None) -> str:
    """A Google Flights search results page, prefilled via its query string
    convention — not a bookable link, opens the real search for the user."""
    query = f"Flights to {destination}"
    if origin:
        query = f"Flights from {origin} to {destination}"
    if depart_date:
        query += f" on {depart_date.isoformat()}"
    return f"{GOOGLE_FLIGHTS_URL}?q={quote(query)}"


def skyscanner_url(origin: str | None, destination: str) -> str:
    """A Skyscanner search landing page — Skyscanner has no open self-serve
    search API, so this links out to their site rather than calling one."""
    query = urlencode({"query": f"{origin or 'anywhere'} to {destination}"})
    return f"{SKYSCANNER_SEARCH_URL}?{query}"


def booking_url(hotel_name: str, destination: str, check_in: date | None = None, check_out: date | None = None) -> str:
    """A Booking.com search results page prefilled with the hotel name and
    destination — Booking.com has no open self-serve booking API, so this
    links out to their real search rather than calling one."""
    params = {"ss": f"{hotel_name}, {destination}"}
    if check_in:
        params["checkin"] = check_in.isoformat()
    if check_out:
        params["checkout"] = check_out.isoformat()
    return f"{BOOKING_SEARCH_URL}?{urlencode(params)}"
