from agents import Agent

from backend.dal.base_agent import BaseAgent
from backend.models.gmail import DetectedTrips

SYSTEM_PROMPT = """You are the Trip Lookup Agent for Tripio, an AI travel planner.
You are given a list of email metadata (subject, sender, date, snippet) that a search
already narrowed down to likely travel-related messages. Your job is to decide which
of them actually describe a real trip (a flight, hotel, or other booking), and extract
the destination and travel dates when they're evident from the subject/snippet alone.

Set "isFlight" to true only for emails that are specifically an airline flight
confirmation/itinerary/boarding pass (the destination is where the flight lands).
Set it to false for hotel, car rental, or other non-flight travel bookings. This
matters because flights are what anchor a trip's destination and dates for the
traveler — hotel-only bookings are supporting detail, not the anchor.

Do not guess a destination or date you can't reasonably infer from the given text.
If an email is ambiguous or clearly not a real booking (e.g. a newsletter, a marketing
email, a receipt for something unrelated to travel), leave it out of your response
entirely rather than including it with null fields.

Set "confidence" to "high" when the subject/snippet clearly names a destination and
date, "medium" when only one of those is clear, and "low" when you're including it
mainly because of matched keywords but the details are unclear."""


class TripLookupAgent(BaseAgent[DetectedTrips]):
    name = "Trip Lookup Agent"

    def build_agent(self) -> Agent:
        return Agent(
            name=self.name,
            instructions=SYSTEM_PROMPT,
            model="gpt-5.5",
            output_type=DetectedTrips,
        )
