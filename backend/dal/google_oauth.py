import os

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly"


def is_configured() -> bool:
    return bool(os.environ.get("GOOGLE_CLIENT_ID") and os.environ.get("GOOGLE_CLIENT_SECRET"))


def _client_config() -> dict:
    return {
        "web": {
            "client_id": os.environ["GOOGLE_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [os.environ["GOOGLE_REDIRECT_URI"]],
        }
    }


def build_flow() -> Flow:
    flow = Flow.from_client_config(_client_config(), scopes=[GMAIL_READONLY_SCOPE])
    flow.redirect_uri = os.environ["GOOGLE_REDIRECT_URI"]
    return flow


def get_authorization_url() -> str:
    flow = build_flow()
    authorization_url, _state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    return authorization_url


def exchange_code_for_credentials(authorization_response_url: str) -> Credentials:
    flow = build_flow()
    flow.fetch_token(authorization_response=authorization_response_url)
    return flow.credentials
