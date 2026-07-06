from typing import Optional

from pydantic import BaseModel, Field


class DiagnosisTraits(BaseModel):
    travelerType: Optional[str] = None
    pace: Optional[str] = None
    comfortLevel: Optional[str] = None
    planningStyle: Optional[str] = None
    preferredBudget: Optional[str] = None
    interests: Optional[list[str]] = None
    dealbreakers: Optional[list[str]] = None
    hotelStyle: Optional[str] = None
    foodStyle: Optional[str] = None
    transportStyle: Optional[str] = None


class DiagnosisOption(BaseModel):
    id: str
    label: str
    description: str
    icon: str
    traits: DiagnosisTraits


class DiagnosisQuestion(BaseModel):
    id: str
    order: int
    title: str
    subtitle: str
    options: list[DiagnosisOption]


class DiagnosisAnswer(BaseModel):
    questionId: str
    optionId: str


class NextQuestionRequest(BaseModel):
    answers: list[DiagnosisAnswer] = Field(default_factory=list)
    answeredQuestions: list[DiagnosisQuestion] = Field(default_factory=list)


class TravelDiagnosisProfile(BaseModel):
    id: str
    travelerType: str
    pace: str
    preferredBudget: str
    comfortLevel: str
    planningStyle: str
    accommodationStyle: str
    hotelStyle: str
    foodStyle: str
    transportStyle: str
    dealbreakers: list[str]
    interests: list[str]
    summary: str


class BuildProfileRequest(BaseModel):
    answers: list[DiagnosisAnswer]
    answeredQuestions: list[DiagnosisQuestion]
