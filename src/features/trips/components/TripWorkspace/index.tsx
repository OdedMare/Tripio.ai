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
      <div className="rounded-[32px] border border-violet-200/70 bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-900 p-6 text-white shadow-[0_30px_90px_-30px_rgba(109,40,217,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200">
              <Sparkles size={16} />
              Tripio agent
            </p>
            <h3 className="text-3xl font-semibold tracking-tight">Let&apos;s build your next escape.</h3>
            <p className="mt-2 text-sm text-violet-100/90">Pick your destination and travel style, and I&apos;ll shape a calm, premium itinerary around you.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-violet-50">
            <div className="flex items-center gap-2">
              <Compass size={16} />
              Conversation-first planning
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="mb-4 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">A</div>
              Tripio
            </div>
            <p className="leading-7">I&apos;m ready to design a trip that feels effortless, thoughtful, and beautifully paced. Tell me where you want to go, what you love, and how you want to feel.</p>
          </div>

          <Link
            href="/trips/new"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400"
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
