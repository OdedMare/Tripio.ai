const ESTIMATED_MIN_QUESTIONS = 5;
const ESTIMATED_MAX_QUESTIONS = 12;

interface ProgressIndicatorProps {
  step: number;
  isLastQuestion: boolean;
}

export function ProgressIndicator({ step, isLastQuestion }: ProgressIndicatorProps) {
  const estimatedTotal = Math.max(ESTIMATED_MIN_QUESTIONS, Math.min(step, ESTIMATED_MAX_QUESTIONS));
  const percent = isLastQuestion ? 100 : Math.round((step / estimatedTotal) * 90);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Question {step}</span>
        <span>{isLastQuestion ? "Almost done" : "Building your profile"}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
