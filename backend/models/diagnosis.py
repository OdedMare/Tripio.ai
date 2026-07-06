from typing import Literal, Optional

from pydantic import BaseModel, Field

TravelerType = Literal["explorer", "relaxer", "culture-seeker", "foodie", "thrill-seeker", "connector"]
Pace = Literal["relaxed", "balanced", "adventurous"]
ComfortLevel = Literal["backpacker", "comfortable", "premium", "luxury"]
PlanningStyle = Literal["fully-planned", "loosely-planned", "spontaneous"]
Budget = Literal["budget", "midRange", "luxury"]

Icon = Literal[
    "compass", "sun", "landmark", "utensils", "mountain-snow", "users", "coffee",
    "scale", "zap", "calendar-x", "camera-off", "bus", "bed-double", "trees",
    "building-2", "map-pin", "backpack", "home", "gem", "crown", "list-checks",
    "shuffle", "dice-5", "sparkles", "palmtree", "house", "key", "footprints",
    "car", "car-front", "train",
]


class DiagnosisTraits(BaseModel):
    travelerType: Optional[TravelerType] = None
    pace: Optional[Pace] = None
    comfortLevel: Optional[ComfortLevel] = None
    planningStyle: Optional[PlanningStyle] = None
    preferredBudget: Optional[Budget] = None
    interests: Optional[list[str]] = None
    dealbreakers: Optional[list[str]] = None
    hotelStyle: Optional[str] = None
    foodStyle: Optional[str] = None
    transportStyle: Optional[str] = None


class DiagnosisOption(BaseModel):
    id: str
    label: str
    description: str
    icon: Icon
    traits: DiagnosisTraits


class GeneratedQuestion(BaseModel):
    """Shape the Diagnosis Agent produces — no `order`, the service layer sequences it."""

    id: str
    title: str
    subtitle: str
    options: list[DiagnosisOption]


class GeneratedQuestionSet(BaseModel):
    """The agent generates the full ordered question set in a single call."""

    questions: list[GeneratedQuestion]


class DiagnosisQuestion(BaseModel):
    id: str
    order: int
    title: str
    subtitle: str
    options: list[DiagnosisOption]
    isLastQuestion: bool = False


class DiagnosisAnswer(BaseModel):
    questionId: str
    optionId: str


class NextQuestionRequest(BaseModel):
    answers: list[DiagnosisAnswer] = Field(default_factory=list)
    answeredQuestions: list[DiagnosisQuestion] = Field(default_factory=list)


class TravelDiagnosisProfile(BaseModel):
    id: str
    travelerType: TravelerType
    pace: Pace
    preferredBudget: Budget
    comfortLevel: ComfortLevel
    planningStyle: PlanningStyle
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
