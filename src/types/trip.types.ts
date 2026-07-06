export interface TripDay {
  dayNumber: number;
  title: string;
  focus: string;
  notes: string;
}

export interface TripFlight {
  airline: string;
  route: string;
  estimatedPriceRange: string;
  duration: string;
  stops: string;
  note: string;
  skyscannerUrl?: string;
  googleFlightsUrl?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  amenities: string[];
  image: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUri?: string | null;
  websiteUri?: string | null;
  bookingUrl?: string | null;
  airbnbUrl?: string | null;
  dayStart?: number;
  dayEnd?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  label?: string;
  summary?: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUri?: string | null;
  websiteUri?: string | null;
  dayNumber?: number;
}

export interface Attraction {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  estimatedVisitDuration?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUri?: string | null;
  websiteUri?: string | null;
  dayNumber?: number;
}

export interface TravelProfile {
  id: string;
  pace: "relaxed" | "balanced" | "adventurous";
  interests: string[];
  preferredBudget: "budget" | "midRange" | "luxury";
  accommodationStyle: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  dates: string;
  summary: string;
  image: string;
  highlights: string[];
  createdAt: string;
  days: TripDay[];
  flights: TripFlight[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  profile: TravelProfile;
}
