"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useTripStore } from "@/store/trip.store";

export default function TripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { currentTripId, setCurrentTripId } = useTripStore();

  useEffect(() => {
    if (tripId && tripId !== currentTripId) {
      setCurrentTripId(tripId);
    }
  }, [tripId, currentTripId, setCurrentTripId]);

  return <AppShell />;
}
