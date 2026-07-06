"use client";

import { Sparkles } from "lucide-react";
import type { DiagnosisAnswer, DiagnosisQuestion } from "@/types/diagnosis.types";

interface ProfilePreviewPanelProps {
  questionHistory: DiagnosisQuestion[];
  answers: DiagnosisAnswer[];
}

export function ProfilePreviewPanel({ questionHistory, answers }: ProfilePreviewPanelProps) {
  const answeredTraits = questionHistory
    .map((question, index) => {
      const answer = answers[index];
      const option = answer ? question.options.find((item) => item.id === answer.optionId) : undefined;
      return option ? { question, option, key: `${index}-${question.id}` } : null;
    })
    .filter((entry): entry is { question: DiagnosisQuestion; option: NonNullable<typeof entry>["option"]; key: string } => entry !== null);

  return (
    <div className="w-full max-w-xs rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Live preview</p>
          <p className="text-sm font-semibold text-slate-900">Your Travel Profile</p>
        </div>
      </div>

      {answeredTraits.length === 0 ? (
        <p className="text-sm text-slate-400">Your travel style will build up here as you answer.</p>
      ) : (
        <ul className="space-y-3">
          {answeredTraits.map(({ question, option, key }) => (
            <li key={key} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{question.title}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{option.label}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
