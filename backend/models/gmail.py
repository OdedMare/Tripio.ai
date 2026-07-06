from pydantic import BaseModel


class GmailConnectionStatus(BaseModel):
    connected: bool


class DetectedTrip(BaseModel):
    destination: str | None
    dates: str | None
    confidence: str  # "high" | "medium" | "low"
    sourceSubject: str


class DetectedTrips(BaseModel):
    trips: list[DetectedTrip]
