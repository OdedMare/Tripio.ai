import { mockTrips } from "@/mock/trip.mock";
import type { Trip } from "@/types/trip.types";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    await delay();
    return mockTrips.map((trip) => ({ ...trip }));
  },

  async getTripById(tripId: string): Promise<Trip> {
    await delay();
    const trip = mockTrips.find((item) => item.id === tripId);

    if (!trip) {
      throw new Error(`Trip ${tripId} not found`);
    }

    return { ...trip };
  },

  async createTrip(prompt: string): Promise<Trip> {
    await delay();
    const title = prompt.length > 32 ? `${prompt.slice(0, 29)}...` : prompt;

    const createdTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      description: "A thoughtfully drafted escape based on your dream brief.",
      location: "Your next destination",
      duration: "6 days",
      dates: "TBD",
      summary: prompt,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
      highlights: ["AI-curated plan", "Soft luxury", "Flexible pacing"],
      createdAt: new Date().toISOString().slice(0, 10),
      days: [
        {
          dayNumber: 1,
          title: "Arrival and settle in",
          focus: "Ease into the trip",
          notes: "Keep the first evening intentionally light and restorative.",
        },
      ],
      hotels: [],
      restaurants: [],
      attractions: [],
      profile: {
        id: `profile-${Date.now()}`,
        pace: "balanced",
        interests: ["Food", "Design", "Culture"],
        preferredBudget: "midRange",
        accommodationStyle: "Boutique and walkable",
      },
    };

    return createdTrip;
  },
};
