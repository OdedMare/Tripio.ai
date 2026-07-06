"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { TravelLoadingIcon } from "@/features/diagnosis/components/TravelLoadingIcon";
import type { PlanningStageProgress } from "@/types/planning.types";

interface PlanningLoaderProps {
  stages: PlanningStageProgress[];
}

const AGENT_TITLES: Record<PlanningStageProgress["agent"], string> = {
  planner: "Planner agent",
  itinerary: "Itinerary agent",
  hotel: "Hotel agent",
  attractions: "Attractions agent",
  restaurants: "Restaurant agent",
};

export function PlanningLoader({ stages }: PlanningLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <TravelLoadingIcon size={22} />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">Building your trip plan</p>
          <p className="mt-1 text-sm text-slate-500">Finding flights, hotels, and attractions that fit your style...</p>
        </div>

        {stages.length > 0 && (
          <div className="w-full space-y-2 text-left">
            {stages.map((stage) => (
              <StageRow key={`${stage.agent}-${stage.leg ?? ""}`} stage={stage} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StageRow({ stage }: { stage: PlanningStageProgress }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = stage.status === "done" && Boolean(stage.response);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => canExpand && setIsExpanded((prev) => !prev)}
        disabled={!canExpand}
        className="flex w-full items-center justify-between gap-3 text-left disabled:cursor-default"
      >
        <div className="flex items-center gap-3">
          {stage.status === "running" ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
              ✓
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {AGENT_TITLES[stage.agent]}
              {stage.leg && <span className="font-normal text-slate-500"> — {stage.leg}</span>}
            </p>
            <p className="text-xs text-slate-500">{stage.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stage.model && (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {stage.model}
            </span>
          )}
          {canExpand && (isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />)}
        </div>
      </button>

      {isExpanded && stage.response && (
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-slate-950 p-3 text-[11px] leading-relaxed text-slate-200">
          {stage.response}
        </pre>
      )}
    </div>
  );
}
