import { create } from "zustand";
import { diagnosisService } from "@/services/diagnosis.service";
import type { DiagnosisAnswer, DiagnosisQuestion, TravelDiagnosisProfile } from "@/types/diagnosis.types";

interface DiagnosisState {
  questions: DiagnosisQuestion[];
  answers: DiagnosisAnswer[];
  profile: TravelDiagnosisProfile | null;
  isLoading: boolean;
  isComplete: boolean;
  start: () => Promise<void>;
  selectOption: (questionId: string, optionId: string) => Promise<void>;
  goBack: () => void;
  reset: () => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  questions: [],
  answers: [],
  profile: null,
  isLoading: false,
  isComplete: false,

  start: async () => {
    if (get().questions.length > 0 || get().isLoading) return;
    set({ isLoading: true });
    const questions = await diagnosisService.getQuestionSet();
    set({ questions, isLoading: false });
  },

  selectOption: async (questionId, optionId) => {
    const { questions, answers, isLoading } = get();
    const current = questions[answers.length];
    if (!current || current.id !== questionId || isLoading) return;

    const nextAnswers = [...answers, { questionId, optionId }];

    if (current.isLastQuestion || nextAnswers.length >= questions.length) {
      set({ answers: nextAnswers, isLoading: true });
      const profile = await diagnosisService.buildProfile(nextAnswers, questions.slice(0, nextAnswers.length));
      set({ profile, isComplete: true, isLoading: false });
      return;
    }

    set({ answers: nextAnswers });
  },

  goBack: () => {
    const { answers } = get();
    if (answers.length === 0) return;
    set({ answers: answers.slice(0, -1), isComplete: false });
  },

  reset: () =>
    set({ questions: [], answers: [], profile: null, isComplete: false, isLoading: false }),
}));

export function selectCurrentQuestion(state: DiagnosisState): DiagnosisQuestion | null {
  if (state.isComplete) return null;
  return state.questions[state.answers.length] ?? null;
}

export function selectQuestionHistory(state: DiagnosisState): DiagnosisQuestion[] {
  return state.questions.slice(0, state.answers.length);
}
