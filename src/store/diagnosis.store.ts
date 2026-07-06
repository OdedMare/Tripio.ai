import { create } from "zustand";
import { diagnosisService } from "@/services/diagnosis.service";
import type { DiagnosisAnswer, DiagnosisQuestion, TravelDiagnosisProfile } from "@/types/diagnosis.types";

interface DiagnosisState {
  questionHistory: DiagnosisQuestion[];
  currentQuestion: DiagnosisQuestion | null;
  answers: DiagnosisAnswer[];
  profile: TravelDiagnosisProfile | null;
  isLoading: boolean;
  isComplete: boolean;
  totalQuestions: number;
  start: () => Promise<void>;
  selectOption: (questionId: string, optionId: string) => Promise<void>;
  goBack: () => void;
  reset: () => void;
}

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  questionHistory: [],
  currentQuestion: null,
  answers: [],
  profile: null,
  isLoading: false,
  isComplete: false,
  totalQuestions: diagnosisService.totalQuestions,

  start: async () => {
    if (get().currentQuestion || get().isLoading) return;
    set({ isLoading: true });
    const question = await diagnosisService.getNextQuestion([], []);
    set({ currentQuestion: question, isLoading: false });
  },

  selectOption: async (questionId, optionId) => {
    const { answers, questionHistory, currentQuestion, totalQuestions } = get();
    if (!currentQuestion || currentQuestion.id !== questionId) return;

    const nextAnswers = [...answers, { questionId, optionId }];
    const nextHistory = [...questionHistory, currentQuestion];
    const isLastQuestion = nextAnswers.length >= totalQuestions;

    set({ answers: nextAnswers, questionHistory: nextHistory, isLoading: true });

    if (isLastQuestion) {
      const profile = await diagnosisService.buildProfile(nextAnswers, nextHistory);
      set({ profile, isComplete: true, isLoading: false, currentQuestion: null });
      return;
    }

    const question = await diagnosisService.getNextQuestion(nextAnswers, nextHistory);
    set({ currentQuestion: question, isLoading: false });
  },

  goBack: () => {
    const { questionHistory } = get();
    if (questionHistory.length === 0) return;

    const previousQuestion = questionHistory[questionHistory.length - 1];
    set({
      currentQuestion: previousQuestion,
      questionHistory: questionHistory.slice(0, -1),
      answers: get().answers.slice(0, -1),
      isComplete: false,
    });
  },

  reset: () =>
    set({ questionHistory: [], currentQuestion: null, answers: [], profile: null, isComplete: false }),
}));
