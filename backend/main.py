from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from backend.api.diagnosis import router as diagnosis_router  # noqa: E402
from backend.api.gmail import router as gmail_router  # noqa: E402
from backend.api.places import router as places_router  # noqa: E402
from backend.api.planning import router as planning_router  # noqa: E402

app = FastAPI(title="Tripio Agents API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagnosis_router)
app.include_router(gmail_router)
app.include_router(places_router)
app.include_router(planning_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
