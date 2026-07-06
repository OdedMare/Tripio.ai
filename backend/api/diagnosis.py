from fastapi import APIRouter

from backend.models.diagnosis import (
    BuildProfileRequest,
    DiagnosisQuestion,
    NextQuestionRequest,
    TravelDiagnosisProfile,
)
from backend.services import diagnosis_service

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("/next-question", response_model=DiagnosisQuestion)
async def next_question(payload: NextQuestionRequest) -> DiagnosisQuestion:
    return await diagnosis_service.get_next_question(payload.answers, payload.answeredQuestions)


@router.post("/profile", response_model=TravelDiagnosisProfile)
def profile(payload: BuildProfileRequest) -> TravelDiagnosisProfile:
    return diagnosis_service.build_profile(payload.answers, payload.answeredQuestions)
