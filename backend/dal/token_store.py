from google.oauth2.credentials import Credentials

# In-memory only: no database yet, and this is a single-user local dev app.
# Lost on backend restart — the user reconnects Gmail when that happens.
_tokens: dict[str, Credentials] = {}

DEFAULT_USER_ID = "default-user"


def save_credentials(credentials: Credentials, user_id: str = DEFAULT_USER_ID) -> None:
    _tokens[user_id] = credentials


def get_credentials(user_id: str = DEFAULT_USER_ID) -> Credentials | None:
    return _tokens.get(user_id)


def is_connected(user_id: str = DEFAULT_USER_ID) -> bool:
    return user_id in _tokens
