from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from backend.dal import google_oauth, token_store
from backend.models.gmail import DetectedTrip, GmailConnectionStatus
from backend.services import gmail_service

router = APIRouter(tags=["gmail"])

FRONTEND_URL = "http://localhost:3000"


@router.get("/auth/gmail/login")
def gmail_login() -> RedirectResponse:
    if not google_oauth.is_configured():
        raise HTTPException(status_code=503, detail="Google OAuth is not configured on the server")
    return RedirectResponse(google_oauth.get_authorization_url())


@router.get("/auth/gmail/callback")
def gmail_callback(request_url: str) -> RedirectResponse:
    credentials = google_oauth.exchange_code_for_credentials(request_url)
    token_store.save_credentials(credentials)
    return RedirectResponse(f"{FRONTEND_URL}/diagnosis?gmail=connected")


@router.get("/gmail/status", response_model=GmailConnectionStatus)
def gmail_status() -> GmailConnectionStatus:
    return GmailConnectionStatus(connected=gmail_service.is_connected())


@router.get("/gmail/trips", response_model=list[DetectedTrip])
async def gmail_trips() -> list[DetectedTrip]:
    if not gmail_service.is_connected():
        raise HTTPException(status_code=409, detail="Gmail is not connected")
    return await gmail_service.find_recent_trips()
