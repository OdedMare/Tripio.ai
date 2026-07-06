import time
import uuid
from dataclasses import dataclass, field

from backend.dal.agents.diagnosis_agent import DiagnosisAgent
from backend.dal.base_agent import is_configured
from backend.dal.question_bank import get_fallback_question_set
from backend.models.diagnosis import (
    DiagnosisAnswer,
    DiagnosisOption,
    DiagnosisQuestion,
    DiagnosisTraits,
    TravelDiagnosisProfile,
)

QUESTION_SET_PROMPT = "Design the full diagnosis question set now."

_diagnosis_agent = DiagnosisAgent()


def _unique_question_id(order: int) -> str:
    """
    The agent's own `id` field is not guaranteed unique across generations,
    so the service layer — not the model — is the source of truth for identity.
    """
    return f"question-{order}-{uuid.uuid4().hex[:8]}"


async def get_question_set() -> list[DiagnosisQuestion]:
    if not is_configured():
        return get_fallback_question_set()

    try:
        generated = await _diagnosis_agent.run(QUESTION_SET_PROMPT)
        last_index = len(generated.questions) - 1
        return [
            DiagnosisQuestion(
                id=_unique_question_id(index + 1),
                order=index + 1,
                title=question.title,
                subtitle=question.subtitle,
                options=question.options,
                isLastQuestion=index == last_index,
            )
            for index, question in enumerate(generated.questions)
        ]
    except Exception:
        return get_fallback_question_set()


_DEFAULT_TRAVELER_TYPE = "explorer"
_DEFAULT_PACE = "balanced"
_DEFAULT_BUDGET = "midRange"
_DEFAULT_COMFORT = "comfortable"
_DEFAULT_PLANNING = "loosely-planned"
_DEFAULT_HOTEL_STYLE = "Boutique, design-led"
_DEFAULT_FOOD_STYLE = "Casual, local favorites"
_DEFAULT_TRANSPORT_STYLE = "Mixed transit"


@dataclass
class ProfileDraft:
    """Mutable accumulator for the fields a TravelDiagnosisProfile is built from."""

    traveler_type: str = _DEFAULT_TRAVELER_TYPE
    pace: str = _DEFAULT_PACE
    preferred_budget: str = _DEFAULT_BUDGET
    comfort_level: str = _DEFAULT_COMFORT
    planning_style: str = _DEFAULT_PLANNING
    hotel_style: str = _DEFAULT_HOTEL_STYLE
    food_style: str = _DEFAULT_FOOD_STYLE
    transport_style: str = _DEFAULT_TRANSPORT_STYLE
    interests: set[str] = field(default_factory=set)
    dealbreakers: set[str] = field(default_factory=set)

    def apply(self, traits: DiagnosisTraits) -> None:
        if traits.travelerType:
            self.traveler_type = traits.travelerType
        if traits.pace:
            self.pace = traits.pace
        if traits.preferredBudget:
            self.preferred_budget = traits.preferredBudget
        if traits.comfortLevel:
            self.comfort_level = traits.comfortLevel
        if traits.planningStyle:
            self.planning_style = traits.planningStyle
        if traits.hotelStyle:
            self.hotel_style = traits.hotelStyle
        if traits.foodStyle:
            self.food_style = traits.foodStyle
        if traits.transportStyle:
            self.transport_style = traits.transportStyle
        if traits.interests:
            self.interests.update(traits.interests)
        if traits.dealbreakers:
            self.dealbreakers.update(traits.dealbreakers)

    def summary(self) -> str:
        traveler_label = self.traveler_type.replace("-", " ")
        planning_label = self.planning_style.replace("-", " ")
        return f"A {self.pace}-paced {traveler_label} who values {self.comfort_level} comfort and {planning_label} trips."


def _find_selected_option(
    question: DiagnosisQuestion,
    answer: DiagnosisAnswer,
) -> DiagnosisOption | None:
    return next((o for o in question.options if o.id == answer.optionId), None)


def _accumulate_traits(
    answers: list[DiagnosisAnswer],
    answered_questions: list[DiagnosisQuestion],
) -> ProfileDraft:
    """
    `answers[i]` always corresponds to `answered_questions[i]` — they're appended
    in lockstep by the client. Match by position, not by `questionId`: generated
    question ids are not guaranteed unique across separate agent calls.
    """
    draft = ProfileDraft()
    for question, answer in zip(answered_questions, answers):
        option = _find_selected_option(question, answer)
        if option:
            draft.apply(option.traits)
    return draft


def _finalize_profile(draft: ProfileDraft) -> TravelDiagnosisProfile:
    return TravelDiagnosisProfile(
        id=f"profile-{int(time.time() * 1000)}",
        travelerType=draft.traveler_type,
        pace=draft.pace,
        preferredBudget=draft.preferred_budget,
        comfortLevel=draft.comfort_level,
        planningStyle=draft.planning_style,
        accommodationStyle=draft.hotel_style,
        hotelStyle=draft.hotel_style,
        foodStyle=draft.food_style,
        transportStyle=draft.transport_style,
        dealbreakers=sorted(draft.dealbreakers),
        interests=sorted(draft.interests),
        summary=draft.summary(),
    )


def build_profile(
    answers: list[DiagnosisAnswer],
    answered_questions: list[DiagnosisQuestion],
) -> TravelDiagnosisProfile:
    draft = _accumulate_traits(answers, answered_questions)
    return _finalize_profile(draft)
