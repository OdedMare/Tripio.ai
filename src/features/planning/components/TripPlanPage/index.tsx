"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosisStore } from "@/store/diagnosis.store";
import { useTripIntentStore } from "@/store/tripIntent.store";
import { planningService } from "@/services/planning.service";
import { PlanningLoader } from "@/features/planning/components/PlanningLoader";
import { TripPlanResult } from "@/features/planning/components/TripPlanResult";
import type { PlanningStageProgress, TripPlan } from "@/types/planning.types";

export function TripPlanPage() {
  const router = useRouter();
  const profile = useDiagnosisStore((state) => state.profile);
  const { destination, dates, includeFlights } = useTripIntentStore();

  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stages, setStages] = useState<PlanningStageProgress[]>([]);

  useEffect(() => {
    if (!profile || !destination) {
      router.replace("/trips/new");
      return;
    }

    const controller = new AbortController();

    void planningService
      .planTripStream(
        { destination, dates, profile, includeFlights },
        (event) => {
          if (event.type === "stage-start") {
            setStages((prev) => [...prev, { agent: event.agent, label: event.label, status: "running" }]);
          } else if (event.type === "stage-done") {
            setStages((prev) =>
              prev.map((stage) =>
                stage.agent === event.agent
                  ? { ...stage, status: "done", model: event.model, response: event.response }
                  : stage,
              ),
            );
          }
        },
        controller.signal,
      )
      .then((result) => setPlan(result))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("We couldn't build your trip plan right now. Please try again.");
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-rose-500">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return <PlanningLoader stages={stages} />;
  }

  return <TripPlanResult plan={plan} />;
}
