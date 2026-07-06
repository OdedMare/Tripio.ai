"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Compass, Home, Map, PlusCircle, Sparkles, UserRound } from "lucide-react";
import { useTripStore } from "@/store/trip.store";
import { TripSidebar } from "@/features/trips/components/TripSidebar";
import { TripWorkspace } from "@/features/trips/components/TripWorkspace";

export function AppShell() {
  const { trips, currentTripId, fetchTrips, hydrateCollections } = useTripStore();

  useEffect(() => {
    void fetchTrips();
    void hydrateCollections();
  }, [fetchTrips, hydrateCollections]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_#f4f4f5_55%,_#ece7e1)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 lg:flex-row lg:gap-4 lg:px-6 lg:py-6">
        <aside className="w-full rounded-[28px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur lg:w-[320px] lg:p-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Tripio</p>
              <h1 className="text-xl font-semibold text-slate-900">Travel Planner</h1>
            </div>
            <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
              <Sparkles size={18} />
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-900 p-2 text-white">
                <Home size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">My trips</p>
                <p className="text-xs text-slate-500">Curated for every mood</p>
              </div>
            </div>
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Home
            </Link>
          </div>

          <div className="mb-5 space-y-2">
            <Link
              href="/diagnosis"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <PlusCircle size={18} />
              New trip
            </Link>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Compass size={18} />
              Explore ideas
            </button>
          </div>

          <TripSidebar trips={trips} currentTripId={currentTripId} />

          <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Map size={16} />
              <p className="text-sm font-semibold">Map-first planning</p>
            </div>
            <p className="text-sm text-slate-200">Sketch your route, save favorites, and let the workspace guide your next chapter.</p>
          </div>
        </aside>

        <main className="flex-1 rounded-[28px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">AI trip builder</p>
              <h2 className="text-2xl font-semibold text-slate-900">Your planning studio</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <UserRound size={16} />
              Premium preview
            </div>
          </div>

          <TripWorkspace />
        </main>
      </div>
    </div>
  );
}
