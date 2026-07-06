import { create } from "zustand";
import { tripService } from "@/services/trip.service";
import type { Trip } from "@/types/trip.types";

interface TripState {
  trips: Trip[];
  currentTripId: string | null;
  isLoading: boolean;
  selectedTrip: Trip | null;
  fetchTrips: () => Promise<void>;
  fetchTrip: (tripId: string) => Promise<void>;
  saveTrip: (trip: Trip) => Promise<void>;
  updateTrip: (trip: Trip) => Promise<void>;
  setCurrentTripId: (tripId: string | null) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTripId: null,
  isLoading: false,
  selectedTrip: null,

  fetchTrips: async () => {
    set({ isLoading: true });
    const trips = await tripService.getTrips();
    const firstTrip = trips[0];
    set({ trips, currentTripId: firstTrip?.id ?? null, selectedTrip: firstTrip ?? null, isLoading: false });
  },

  fetchTrip: async (tripId: string) => {
    set({ isLoading: true });
    const trip = await tripService.getTripById(tripId);
    set({ selectedTrip: trip, currentTripId: trip.id, isLoading: false });
  },

  saveTrip: async (trip: Trip) => {
    set({ isLoading: true });
    const saved = await tripService.saveTrip(trip);
    set((state) => ({ trips: [saved, ...state.trips], currentTripId: saved.id, selectedTrip: saved, isLoading: false }));
  },

  updateTrip: async (trip: Trip) => {
    const updated = await tripService.updateTrip(trip);
    set((state) => ({
      trips: state.trips.map((item) => (item.id === updated.id ? updated : item)),
      selectedTrip: state.selectedTrip?.id === updated.id ? updated : state.selectedTrip,
    }));
  },

  setCurrentTripId: (tripId) => {
    const trip = get().trips.find((item) => item.id === tripId) ?? null;
    set({ currentTripId: tripId, selectedTrip: trip });
  },
}));
