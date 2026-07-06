import time
from dataclasses import dataclass, field

from backend.dal.agents.diagnosis_agent import DiagnosisAgent
from backend.dal.base_agent import is_configured
from backend.dal.question_bank import get_fallback_question
from backend.models.diagnosis import (
    DiagnosisAnswer,
    DiagnosisOption,
    DiagnosisQuestion,
    DiagnosisTraits,
    TravelDiagnosisProfile,
)

MIN_QUESTIONS = 5
MAX_QUESTIONS = 12

_diagnosis_agent = DiagnosisAgent()


def _describe_answer(question: DiagnosisQuestion, answer: DiagnosisAnswer | None) -> tuple[str, str]:
    option = next((o for o in question.options if answer and o.id == answer.optionId), None)
    if not option:
        return "unknown", ""
    return option.label, option.description


def _build_history_lines(answers: list[DiagnosisAnswer], answered_questions: list[DiagnosisQuestion]) -> list[str]:
    lines = []
    for index, question in enumerate(answered_questions):
        answer = answers[index] if index < len(answers) else None
        label, description = _describe_answer(question, answer)
        lines.append(f'Q{index + 1}: "{question.title}" -> answered "{label}" ({description})')
    return lines


def _build_user_prompt(answers: list[DiagnosisAnswer], answered_questions: list[DiagnosisQuestion]) -> str:
    step = len(answers)
    if step == 0:
        return "Ask the first question to begin the traveler's diagnosis."

    history = "\n".join(_build_history_lines(answers, answered_questions))
    return (
        f"Here is what we've learned so far ({step} question(s) answered):\n{history}\n\n"
        "Ask the next question, or set isLastQuestion=true on this question if you already "
        "have enough to build a confident profile."
    )


def _apply_question_count_bounds(question: DiagnosisQuestion, step: int) -> DiagnosisQuestion:
    """Safety rail: never finish before MIN_QUESTIONS, never exceed MAX_QUESTIONS."""
    next_question_number = step + 1
    if next_question_number < MIN_QUESTIONS:
        return question.model_copy(update={"isLastQuestion": False})
    if next_question_number >= MAX_QUESTIONS:
        return question.model_copy(update={"isLastQuestion": True})
    return question


async def get_next_question(
    answers: list[DiagnosisAnswer],
    answered_questions: list[DiagnosisQuestion],
) -> DiagnosisQuestion:
    step = len(answers)

    if not is_configured():
        return _apply_question_count_bounds(get_fallback_question(step), step)

    try:
        user_prompt = _build_user_prompt(answers, answered_questions)
        generated = await _diagnosis_agent.run(user_prompt)
        question = DiagnosisQuestion(
            id=generated.id,
            order=step + 1,
            title=generated.title,
            subtitle=generated.subtitle,
            options=generated.options,
            isLastQuestion=generated.isLastQuestion,
        )
        return _apply_question_count_bounds(question, step)
    except Exception:
        return _apply_question_count_bounds(get_fallback_question(step), step)



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
    answer: DiagnosisAnswer,
    answered_questions: list[DiagnosisQuestion],
) -> DiagnosisOption | None:
    question = next((q for q in answered_questions if q.id == answer.questionId), None)
    if not question:
        return None
    return next((o for o in question.options if o.id == answer.optionId), None)


def _accumulate_traits(
    answers: list[DiagnosisAnswer],
    answered_questions: list[DiagnosisQuestion],
) -> ProfileDraft:
    draft = ProfileDraft()
    for answer in answers:
        option = _find_selected_option(answer, answered_questions)
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
