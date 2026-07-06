import type { Trip } from "@/types/trip.types";
import type { DetectedTrip } from "@/types/gmail.types";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80";

function buildBaseTrip(overrides: Partial<Trip> & Pick<Trip, "title" | "location" | "dates" | "summary">): Trip {
  return {
    id: `trip-${Date.now()}`,
    description: "A thoughtfully drafted escape based on your dream brief.",
    duration: "6 days",
    image: PLACEHOLDER_IMAGE,
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
    ...overrides,
  };
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    await delay();
    return [];
  },

  async getTripById(tripId: string): Promise<Trip> {
    await delay();
    throw new Error(`Trip ${tripId} not found`);
  },

  async createTrip(prompt: string): Promise<Trip> {
    await delay();
    const title = prompt.length > 32 ? `${prompt.slice(0, 29)}...` : prompt;

    return buildBaseTrip({
      title,
      location: "Your next destination",
      dates: "TBD",
      summary: prompt,
    });
  },

  async createTripFromDetectedTrip(detectedTrip: DetectedTrip): Promise<Trip> {
    await delay();
    const destination = detectedTrip.destination ?? "Your next destination";

    return buildBaseTrip({
      title: destination,
      location: destination,
      dates: detectedTrip.dates ?? "TBD",
      description: `Imported from a booking confirmation in your inbox: "${detectedTrip.sourceSubject}".`,
      summary: `A trip to ${destination}, detected from your Gmail.`,
    });
  },
};
