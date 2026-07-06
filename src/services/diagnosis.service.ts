import type { DiagnosisAnswer, DiagnosisQuestion, TravelDiagnosisProfile } from "@/types/diagnosis.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL ?? "http://localhost:8000";

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Agents API request to ${path} failed with ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export const diagnosisService = {
  async getQuestionSet(): Promise<DiagnosisQuestion[]> {
    return postJson<DiagnosisQuestion[]>("/diagnosis/questions", {});
  },

  async buildProfile(
    answers: DiagnosisAnswer[],
    answeredQuestions: DiagnosisQuestion[],
  ): Promise<TravelDiagnosisProfile> {
    return postJson<TravelDiagnosisProfile>("/diagnosis/profile", { answers, answeredQuestions });
  },
};
