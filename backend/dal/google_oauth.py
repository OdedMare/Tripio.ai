import os

GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly"

# oauthlib refuses to parse an authorization response over plain HTTP. The
# redirect URI is only ever non-HTTPS during local development (localhost),
# where relaxing this is standard practice and expected by Google's own docs.
if os.environ.get("GOOGLE_REDIRECT_URI", "").startswith("http://"):
    os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")

from google.oauth2.credentials import Credentials  # noqa: E402
from google_auth_oauthlib.flow import Flow  # noqa: E402

# Flow enables PKCE by default, generating a code_verifier that lives only on
# that specific Flow instance. The login step and the callback step are two
# separate requests, so the *same* Flow instance must be reused across them —
# keyed by the OAuth `state` param, which Google echoes back on the callback.
_pending_flows: dict[str, Flow] = {}


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
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    _pending_flows[state] = flow
    return authorization_url


def exchange_code_for_credentials(authorization_response_url: str) -> Credentials:
    state = _extract_state(authorization_response_url)
    flow = _pending_flows.pop(state, None) or build_flow()
    flow.fetch_token(authorization_response=authorization_response_url)
    return flow.credentials


def _extract_state(authorization_response_url: str) -> str | None:
    from urllib.parse import parse_qs, urlparse

    query = parse_qs(urlparse(authorization_response_url).query)
    values = query.get("state")
    return values[0] if values else None
