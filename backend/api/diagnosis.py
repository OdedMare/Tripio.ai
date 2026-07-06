from fastapi import APIRouter

from backend.models.diagnosis import (
    BuildProfileRequest,
    DiagnosisQuestion,
    TravelDiagnosisProfile,
)
from backend.services import diagnosis_service

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("/questions", response_model=list[DiagnosisQuestion])
async def questions() -> list[DiagnosisQuestion]:
    return await diagnosis_service.get_question_set()


@router.post("/profile", response_model=TravelDiagnosisProfile)
def profile(payload: BuildProfileRequest) -> TravelDiagnosisProfile:
    return diagnosis_service.build_profile(payload.answers, payload.answeredQuestions)
