"use client";

import { useEffect } from "react";
import { UserRound } from "lucide-react";
import { useTripStore } from "@/store/trip.store";
import { TripShell } from "@/components/TripShell";
import { TripWorkspace } from "@/features/trips/components/TripWorkspace";

export function AppShell() {
  const { trips, fetchTrips, hydrateCollections } = useTripStore();

  useEffect(() => {
    if (trips.length === 0) {
      void fetchTrips();
    }
    void hydrateCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrips, hydrateCollections]);

  return (
    <TripShell>
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
    </TripShell>
  );
}
