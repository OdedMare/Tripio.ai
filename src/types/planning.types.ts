import type { TravelDiagnosisProfile } from "@/types/diagnosis.types";

export interface FlightSuggestion {
  airline: string;
  route: string;
  estimatedPriceRange: string;
  duration: string;
  stops: string;
  note: string;
  googleFlightsUrl: string | null;
  skyscannerUrl: string | null;
}

export interface HotelSuggestion {
  name: string;
  area: string;
  rating: number;
  priceRange: string;
  amenities: string[];
  description: string;
  latitude: number | null;
  longitude: number | null;
  source: "google-places" | "ai-suggested";
  bookingUrl: string | null;
}

export interface AttractionSuggestion {
  name: string;
  category: string;
  description: string;
  estimatedVisitDuration: string;
  latitude: number | null;
  longitude: number | null;
}

export interface RestaurantSuggestion {
  name: string;
  area: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  source: "google-places" | "ai-suggested";
}

export interface TransportLeg {
  mode: string;
  duration: string;
  notes: string;
}

export interface CityPlan {
  city: string;
  days: number;
  startDay: number;
  endDay: number;
  transportFromPrevious: TransportLeg | null;
  hotels: HotelSuggestion[];
  attractions: AttractionSuggestion[];
  restaurants: RestaurantSuggestion[];
}

export interface TripPlan {
  destination: string;
  dates: string | null;
  totalDays: number | null;
  summary: string;
  flights: FlightSuggestion[];
  itinerary: CityPlan[];
  hotels: HotelSuggestion[];
  attractions: AttractionSuggestion[];
  restaurants: RestaurantSuggestion[];
}

export interface PlanTripRequest {
  destination: string;
  origin?: string | null;
  dates?: string | null;
  totalDays?: number | null;
  profile: TravelDiagnosisProfile;
  includeFlights: boolean;
}

export type PlanningAgentKey = "planner" | "itinerary" | "hotel" | "attractions" | "restaurants";

export interface PlanningStageStartEvent {
  type: "stage-start";
  agent: PlanningAgentKey;
  leg?: string;
  label: string;
}

export interface PlanningStageDoneEvent {
  type: "stage-done";
  agent: PlanningAgentKey;
  leg?: string;
  model: string;
  response: string;
}

export interface PlanningCompleteEvent {
  type: "complete";
  plan: TripPlan;
}

export type PlanningStreamEvent = PlanningStageStartEvent | PlanningStageDoneEvent | PlanningCompleteEvent;

export interface PlanningStageProgress {
  agent: PlanningAgentKey;
  leg?: string;
  label: string;
  status: "running" | "done";
  model?: string;
  response?: string;
}
