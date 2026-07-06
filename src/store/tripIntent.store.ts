import { create } from "zustand";

export type TripSource = "scratch" | "gmail";

interface TripIntentState {
  source: TripSource | null;
  destination: string | null;
  dates: string | null;
  includeFlights: boolean;
  setIntent: (intent: { source: TripSource; destination: string; dates: string | null; includeFlights: boolean }) => void;
  reset: () => void;
}

export const useTripIntentStore = create<TripIntentState>((set) => ({
  source: null,
  destination: null,
  dates: null,
  includeFlights: true,

  setIntent: (intent) =>
    set({
      source: intent.source,
      destination: intent.destination,
      dates: intent.dates,
      includeFlights: intent.includeFlights,
    }),

  reset: () => set({ source: null, destination: null, dates: null, includeFlights: true }),
}));
