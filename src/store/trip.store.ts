import { create } from "zustand";
import { tripService } from "@/services/trip.service";
import { hotelService } from "@/services/hotel.service";
import { restaurantService } from "@/services/restaurant.service";
import { attractionService } from "@/services/attraction.service";
import { profileService } from "@/services/profile.service";
import type { Attraction, Hotel, Restaurant, Trip, TripTab, TravelProfile } from "@/types/trip.types";
import type { DetectedTrip } from "@/types/gmail.types";

interface TripState {
  trips: Trip[];
  currentTripId: string | null;
  activeTab: TripTab;
  isLoading: boolean;
  selectedTrip: Trip | null;
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  profile: TravelProfile | null;
  fetchTrips: () => Promise<void>;
  fetchTrip: (tripId: string) => Promise<void>;
  createTrip: (prompt: string) => Promise<void>;
  createTripFromDetectedTrip: (detectedTrip: DetectedTrip) => Promise<Trip>;
  setCurrentTripId: (tripId: string | null) => void;
  setActiveTab: (tab: TripTab) => void;
  hydrateCollections: () => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTripId: null,
  activeTab: "overview",
  isLoading: false,
  selectedTrip: null,
  hotels: [],
  restaurants: [],
  attractions: [],
  profile: null,

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

  createTrip: async (prompt: string) => {
    set({ isLoading: true });
    const trip = await tripService.createTrip(prompt);
    set((state) => ({ trips: [trip, ...state.trips], currentTripId: trip.id, selectedTrip: trip, activeTab: "overview", isLoading: false }));
  },

  createTripFromDetectedTrip: async (detectedTrip: DetectedTrip) => {
    set({ isLoading: true });
    const trip = await tripService.createTripFromDetectedTrip(detectedTrip);
    set((state) => ({ trips: [trip, ...state.trips], currentTripId: trip.id, selectedTrip: trip, activeTab: "overview", isLoading: false }));
    return trip;
  },

  setCurrentTripId: (tripId) => {
    const trip = get().trips.find((item) => item.id === tripId) ?? null;
    set({ currentTripId: tripId, selectedTrip: trip });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  hydrateCollections: async () => {
    const [hotels, restaurants, attractions, profile] = await Promise.all([
      hotelService.getHotels(),
      restaurantService.getRestaurants(),
      attractionService.getAttractions(),
      profileService.getProfile(),
    ]);

    set({ hotels, restaurants, attractions, profile });
  },
}));
