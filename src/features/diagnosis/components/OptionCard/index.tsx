"use client";

import { Check } from "lucide-react";
import { DiagnosisIcon } from "@/features/diagnosis/icon-map";
import type { DiagnosisOption } from "@/types/diagnosis.types";

interface OptionCardProps {
  option: DiagnosisOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

export function OptionCard({ option, isSelected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`group relative flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition ${
        isSelected
          ? "border-slate-900 bg-slate-900 text-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.45)]"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isSelected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"
        }`}
      >
        <DiagnosisIcon icon={option.icon} size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{option.label}</p>
        <p className={`mt-1 text-sm ${isSelected ? "text-slate-200" : "text-slate-500"}`}>{option.description}</p>
      </div>
      {isSelected && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-slate-900">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
    </button>
  );
}
