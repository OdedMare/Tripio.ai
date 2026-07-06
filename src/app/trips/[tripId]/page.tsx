"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { TripShell } from "@/components/TripShell";
import { TripItinerary } from "@/features/trips/components/TripItinerary";
import { useTripStore } from "@/store/trip.store";

export default function TripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTripId, selectedTrip, fetchTrips, setCurrentTripId } = useTripStore();

  useEffect(() => {
    if (trips.length === 0) {
      void fetchTrips();
    }
  }, [trips.length, fetchTrips]);

  useEffect(() => {
    if (tripId && tripId !== currentTripId) {
      setCurrentTripId(tripId);
    }
  }, [tripId, currentTripId, setCurrentTripId]);

  return (
    <TripShell>
      {selectedTrip ? (
        <TripItinerary trip={selectedTrip} />
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-900">Trip not found</p>
          <p className="mt-2 text-sm text-slate-500">This trip may have been removed, or hasn&apos;t finished saving yet.</p>
        </div>
      )}
    </TripShell>
  );
}
