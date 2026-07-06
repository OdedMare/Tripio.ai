"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Compass, Gem, ListChecks, Utensils } from "lucide-react";
import type { TravelDiagnosisProfile } from "@/types/diagnosis.types";

interface ProfileSummaryProps {
  profile: TravelDiagnosisProfile;
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <CheckCircle size={22} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">All set</p>
          <h2 className="text-2xl font-semibold text-slate-900">Your Travel Profile is ready</h2>
        </div>
      </div>

      <p className="mb-6 text-sm text-slate-600">{profile.summary}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Compass size={16} />
            Traveler type & pace
          </div>
          <p className="text-sm capitalize text-slate-500">{profile.travelerType.replace("-", " ")}</p>
          <p className="text-sm capitalize text-slate-500">{profile.pace} pace</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Gem size={16} />
            Comfort & budget
          </div>
          <p className="text-sm capitalize text-slate-500">{profile.comfortLevel} comfort</p>
          <p className="text-sm capitalize text-slate-500">{profile.preferredBudget} budget</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Utensils size={16} />
            Food & transport
          </div>
          <p className="text-sm text-slate-500">{profile.foodStyle}</p>
          <p className="text-sm text-slate-500">{profile.transportStyle}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ListChecks size={16} />
            Interests
          </div>
          <p className="text-sm text-slate-500">{profile.interests.join(", ") || "—"}</p>
        </div>
      </div>

      {profile.dealbreakers.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-1 text-sm font-semibold text-slate-700">Avoid</p>
          <p className="text-sm text-slate-500">{profile.dealbreakers.join(", ")}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => router.push("/trips/plan")}
        className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Start planning my trip
      </button>
    </div>
  );
}
