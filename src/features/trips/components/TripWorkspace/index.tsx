"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles, UserRound } from "lucide-react";
import { useTripStore } from "@/store/trip.store";

export function TripWorkspace() {
  const router = useRouter();
  const { currentTripId } = useTripStore();

  useEffect(() => {
    if (!currentTripId) {
      return;
    }
    router.replace(`/trips/${currentTripId}`);
  }, [currentTripId, router]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Sparkles size={16} />
            Tripio
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900">Let&apos;s build your next escape.</h3>
          <p className="mt-3 text-base leading-7 text-slate-600">Pick your destination and travel style, and I&apos;ll shape a calm, premium itinerary around you.</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
            <Compass size={16} />
            Conversation-first planning
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/trips/new"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start planning
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <UserRound size={18} />
        </div>
        <p className="text-lg font-semibold text-slate-900">A fresh planning canvas awaits</p>
        <p className="mt-2 text-sm text-slate-500">Start a new trip to open the workspace and see your itinerary unfold.</p>
      </div>
    </div>
  );
}
