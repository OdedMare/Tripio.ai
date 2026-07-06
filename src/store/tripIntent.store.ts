import { create } from "zustand";

export type TripSource = "scratch" | "gmail";

interface TripIntentState {
  source: TripSource | null;
  origin: string | null;
  destination: string | null;
  dates: string | null;
  totalDays: number | null;
  includeFlights: boolean;
  setIntent: (intent: {
    source: TripSource;
    origin?: string | null;
    destination: string;
    dates: string | null;
    totalDays?: number | null;
    includeFlights: boolean;
  }) => void;
  reset: () => void;
}

export const useTripIntentStore = create<TripIntentState>((set) => ({
  source: null,
  origin: null,
  destination: null,
  dates: null,
  totalDays: null,
  includeFlights: true,

  setIntent: (intent) =>
    set({
      source: intent.source,
      origin: intent.origin ?? null,
      destination: intent.destination,
      dates: intent.dates,
      totalDays: intent.totalDays ?? null,
      includeFlights: intent.includeFlights,
    }),

  reset: () => set({ source: null, origin: null, destination: null, dates: null, totalDays: null, includeFlights: true }),
}));
