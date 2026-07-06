"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useDiagnosisStore } from "@/store/diagnosis.store";
import { QuestionCard } from "@/features/diagnosis/components/QuestionCard";
import { ProfilePreviewPanel } from "@/features/diagnosis/components/ProfilePreviewPanel";
import { ProfileSummary } from "@/features/diagnosis/components/ProfileSummary";

export function DiagnosisFlow() {
  const {
    currentQuestion,
    questionHistory,
    answers,
    profile,
    isComplete,
    isLoading,
    totalQuestions,
    start,
    selectOption,
    goBack,
  } = useDiagnosisStore();

  useEffect(() => {
    void start();
  }, [start]);

  if (!currentQuestion && !isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Preparing your next question...</p>
      </div>
    );
  }

  const step = questionHistory.length + 1;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_#f4f4f5_55%,_#ece7e1)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
        <div className="mb-10 flex items-center justify-center gap-2 text-slate-500">
          <Sparkles size={16} />
          <p className="text-sm font-medium">Before I plan your trip, I want to understand your travel style.</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-center">
          {isComplete && profile ? (
            <ProfileSummary profile={profile} />
          ) : (
            currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                step={step}
                total={totalQuestions}
                selectedOptionId={null}
                canGoBack={questionHistory.length > 0}
                onSelect={(optionId) => void selectOption(currentQuestion.id, optionId)}
                onBack={goBack}
              />
            )
          )}

          {!isComplete && (
            <div className="hidden lg:block">
              <ProfilePreviewPanel questionHistory={questionHistory} answers={answers} />
            </div>
          )}
        </div>

        {isLoading && (
          <div className="mt-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Thinking about your next question...
          </div>
        )}
      </div>
    </div>
  );
}
