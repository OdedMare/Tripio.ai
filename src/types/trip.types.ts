export type TripTab = "overview" | "timeline" | "hotels" | "restaurants" | "attractions" | "map" | "profile";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  travelStyle: string;
  preferences: string[];
}

export interface TripDay {
  dayNumber: number;
  title: string;
  focus: string;
  notes: string;
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
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
}

export interface Attraction {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  image: string;
  description: string;
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
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  profile: TravelProfile;
}
