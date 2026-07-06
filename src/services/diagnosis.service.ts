import type { DiagnosisAnswer, DiagnosisQuestion, TravelDiagnosisProfile } from "@/types/diagnosis.types";

const TOTAL_QUESTIONS = 8;

function buildSummary(profile: Omit<TravelDiagnosisProfile, "summary">): string {
  const travelerLabel = profile.travelerType.replace("-", " ");
  const paceLabel = profile.pace;
  const comfortLabel = profile.comfortLevel;

  return `A ${paceLabel}-paced ${travelerLabel} who values ${comfortLabel} comfort and ${profile.planningStyle.replace("-", " ")} trips.`;
}

export const diagnosisService = {
  totalQuestions: TOTAL_QUESTIONS,

  async getNextQuestion(
    answers: DiagnosisAnswer[],
    answeredQuestions: DiagnosisQuestion[],
  ): Promise<DiagnosisQuestion> {
    const response = await fetch("/api/diagnosis/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, answeredQuestions }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate the next question");
    }

    return (await response.json()) as DiagnosisQuestion;
  },

  async buildProfile(
    answers: DiagnosisAnswer[],
    answeredQuestions: DiagnosisQuestion[],
  ): Promise<TravelDiagnosisProfile> {
    const interests = new Set<string>();
    const dealbreakers = new Set<string>();

    const base: Omit<TravelDiagnosisProfile, "summary"> = {
      id: `profile-${Date.now()}`,
      travelerType: "explorer",
      pace: "balanced",
      preferredBudget: "midRange",
      comfortLevel: "comfortable",
      planningStyle: "loosely-planned",
      accommodationStyle: "Boutique hotels near walkable neighborhoods",
      hotelStyle: "Boutique, design-led",
      foodStyle: "Casual, local favorites",
      transportStyle: "Mixed transit",
      dealbreakers: [],
      interests: [],
    };

    for (const answer of answers) {
      const question = answeredQuestions.find((item) => item.id === answer.questionId);
      const option = question?.options.find((item) => item.id === answer.optionId);
      if (!option) continue;

      const { traits } = option;

      if (traits.travelerType) base.travelerType = traits.travelerType;
      if (traits.pace) base.pace = traits.pace;
      if (traits.preferredBudget) base.preferredBudget = traits.preferredBudget;
      if (traits.comfortLevel) base.comfortLevel = traits.comfortLevel;
      if (traits.planningStyle) base.planningStyle = traits.planningStyle;
      if (traits.hotelStyle) base.hotelStyle = traits.hotelStyle;
      if (traits.foodStyle) base.foodStyle = traits.foodStyle;
      if (traits.transportStyle) base.transportStyle = traits.transportStyle;
      if (traits.interests) traits.interests.forEach((interest) => interests.add(interest));
      if (traits.dealbreakers) traits.dealbreakers.forEach((item) => dealbreakers.add(item));
    }

    base.interests = Array.from(interests);
    base.dealbreakers = Array.from(dealbreakers);
    base.accommodationStyle = base.hotelStyle;

    return { ...base, summary: buildSummary(base) };
  },
};
