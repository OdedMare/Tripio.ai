import type { Attraction, Hotel, Restaurant, Trip, TripDay, TripFlight } from "@/types/trip.types";
import type { CityPlan, TripPlan } from "@/types/planning.types";

const STORAGE_KEY = "tripio.trips";
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80";

function readStoredTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Trip[]) : [];
  } catch {
    return [];
  }
}

function writeStoredTrips(trips: Trip[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function buildDaysFromItinerary(itinerary: CityPlan[]): TripDay[] {
  const days: TripDay[] = [];
  for (const leg of itinerary) {
    for (let dayNumber = leg.startDay; dayNumber <= leg.endDay; dayNumber += 1) {
      days.push({
        dayNumber,
        title: leg.city,
        focus: dayNumber === leg.startDay && leg.transportFromPrevious ? `Arrive via ${leg.transportFromPrevious.mode}` : `Explore ${leg.city}`,
        notes: dayNumber === leg.startDay && leg.transportFromPrevious ? leg.transportFromPrevious.notes : "",
      });
    }
  }
  return days;
}

function distributeAcrossDays<T>(items: T[], startDay: number, endDay: number): (T & { dayNumber: number })[] {
  const dayCount = endDay - startDay + 1;
  return items.map((item, index) => ({ ...item, dayNumber: startDay + (index % dayCount) }));
}

export function tripPlanToTrip(plan: TripPlan, overrides: { origin?: string | null } = {}): Trip {
  const flights: TripFlight[] = plan.flights.map((flight) => ({
    airline: flight.airline,
    route: flight.route,
    estimatedPriceRange: flight.estimatedPriceRange,
    duration: flight.duration,
    stops: flight.stops,
    note: flight.note,
    googleFlightsUrl: flight.googleFlightsUrl ?? undefined,
    skyscannerUrl: flight.skyscannerUrl ?? undefined,
  }));

  const hotels: Hotel[] = [];
  const restaurants: Restaurant[] = [];
  const attractions: Attraction[] = [];

  plan.itinerary.forEach((leg, legIndex) => {
    leg.hotels.forEach((hotel, hotelIndex) => {
      hotels.push({
        id: `hotel-${legIndex}-${hotelIndex}`,
        name: hotel.name,
        location: hotel.area,
        rating: hotel.rating,
        priceRange: hotel.priceRange,
        amenities: hotel.amenities,
        image: PLACEHOLDER_IMAGE,
        description: hotel.description,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        bookingUrl: hotel.bookingUrl,
        dayStart: leg.startDay,
        dayEnd: leg.endDay,
      });
    });

    distributeAcrossDays(leg.restaurants, leg.startDay, leg.endDay).forEach((restaurant, restaurantIndex) => {
      restaurants.push({
        id: `restaurant-${legIndex}-${restaurantIndex}`,
        name: restaurant.name,
        location: restaurant.area,
        cuisine: restaurant.cuisine,
        label: restaurant.label,
        summary: restaurant.summary,
        rating: restaurant.rating,
        priceRange: restaurant.priceRange,
        image: PLACEHOLDER_IMAGE,
        description: restaurant.description,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        dayNumber: restaurant.dayNumber,
      });
    });

    distributeAcrossDays(leg.attractions, leg.startDay, leg.endDay).forEach((attraction, attractionIndex) => {
      attractions.push({
        id: `attraction-${legIndex}-${attractionIndex}`,
        name: attraction.name,
        location: leg.city,
        category: attraction.category,
        rating: 4.5,
        image: PLACEHOLDER_IMAGE,
        description: attraction.description,
        estimatedVisitDuration: attraction.estimatedVisitDuration,
        latitude: attraction.latitude,
        longitude: attraction.longitude,
        dayNumber: attraction.dayNumber,
      });
    });
  });

  const days = buildDaysFromItinerary(plan.itinerary);
  const route = plan.itinerary.length > 1 ? plan.itinerary.map((leg) => leg.city).join(" → ") : plan.destination;

  return {
    id: `trip-${Date.now()}`,
    title: plan.destination,
    description: plan.summary,
    location: overrides.origin ? `${overrides.origin} → ${route}` : route,
    duration: plan.totalDays ? `${plan.totalDays} days` : `${days.length || 1} days`,
    dates: plan.dates ?? "TBD",
    summary: plan.summary,
    image: PLACEHOLDER_IMAGE,
    highlights: plan.itinerary.map((leg) => leg.city),
    createdAt: new Date().toISOString().slice(0, 10),
    days,
    flights,
    hotels,
    restaurants,
    attractions,
    profile: {
      id: `profile-${Date.now()}`,
      pace: "balanced",
      interests: [],
      preferredBudget: "midRange",
      accommodationStyle: "Boutique and walkable",
    },
  };
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    return readStoredTrips();
  },

  async getTripById(tripId: string): Promise<Trip> {
    const trip = readStoredTrips().find((item) => item.id === tripId);
    if (!trip) {
      throw new Error(`Trip ${tripId} not found`);
    }
    return trip;
  },

  async saveTrip(trip: Trip): Promise<Trip> {
    const trips = readStoredTrips();
    writeStoredTrips([trip, ...trips]);
    return trip;
  },

  async updateTrip(trip: Trip): Promise<Trip> {
    const trips = readStoredTrips().map((item) => (item.id === trip.id ? trip : item));
    writeStoredTrips(trips);
    return trip;
  },

  async deleteTrip(tripId: string): Promise<void> {
    writeStoredTrips(readStoredTrips().filter((item) => item.id !== tripId));
  },
};
