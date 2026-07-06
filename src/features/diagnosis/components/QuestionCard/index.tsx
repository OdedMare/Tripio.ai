"use client";

import { ArrowLeft } from "lucide-react";
import { OptionCard } from "@/features/diagnosis/components/OptionCard";
import { ProgressIndicator } from "@/features/diagnosis/components/ProgressIndicator";
import type { DiagnosisQuestion } from "@/types/diagnosis.types";

interface QuestionCardProps {
  question: DiagnosisQuestion;
  step: number;
  selectedOptionId: string | null;
  canGoBack: boolean;
  isLoading?: boolean;
  onSelect: (optionId: string) => void;
  onBack: () => void;
}

export function QuestionCard({ question, step, selectedOptionId, canGoBack, isLoading, onSelect, onBack }: QuestionCardProps) {
  return (
    <div
      key={question.id}
      className="w-full max-w-xl rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur animate-fade-in-up"
    >
      <div className="mb-6">
        <ProgressIndicator step={step} isLastQuestion={question.isLastQuestion} />
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Travel style</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{question.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{question.subtitle}</p>

      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            disabled={isLoading}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-0"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </div>
  );
}
