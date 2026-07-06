import type { PlanTripRequest, PlanningStreamEvent, RefineDayRequest, RefinedDayPlan, TripPlan } from "@/types/planning.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL ?? "http://localhost:8000";

export const planningService = {
  async planTrip(request: PlanTripRequest): Promise<TripPlan> {
    const response = await fetch(`${BACKEND_URL}/planning/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Trip planning request failed with ${response.status}`);
    }

    return (await response.json()) as TripPlan;
  },

  async refineDay(request: RefineDayRequest): Promise<RefinedDayPlan> {
    const response = await fetch(`${BACKEND_URL}/planning/day/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Day refine request failed with ${response.status}`);
    }

    return (await response.json()) as RefinedDayPlan;
  },

  async planTripStream(
    request: PlanTripRequest,
    onEvent: (event: PlanningStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<TripPlan> {
    const response = await fetch(`${BACKEND_URL}/planning/plan/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Trip planning request failed with ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let plan: TripPlan | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        const line = chunk.split("\n").find((part) => part.startsWith("data: "));
        if (!line) continue;

        const event = JSON.parse(line.slice("data: ".length)) as PlanningStreamEvent;
        onEvent(event);
        if (event.type === "complete") {
          plan = event.plan;
        }
      }
    }

    if (!plan) {
      throw new Error("Trip planning stream ended without a completed plan.");
    }

    return plan;
  },
};
