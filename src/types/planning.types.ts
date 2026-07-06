import type { TravelDiagnosisProfile } from "@/types/diagnosis.types";

export interface FlightSuggestion {
  airline: string;
  route: string;
  estimatedPriceRange: string;
  duration: string;
  stops: string;
  note: string;
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
}

export interface AttractionSuggestion {
  name: string;
  category: string;
  description: string;
  estimatedVisitDuration: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TripPlan {
  destination: string;
  dates: string | null;
  summary: string;
  flights: FlightSuggestion[];
  hotels: HotelSuggestion[];
  attractions: AttractionSuggestion[];
}

export interface PlanTripRequest {
  destination: string;
  dates?: string | null;
  profile: TravelDiagnosisProfile;
  includeFlights: boolean;
}

export type PlanningAgentKey = "planner" | "hotel" | "attractions";

export interface PlanningStageStartEvent {
  type: "stage-start";
  agent: PlanningAgentKey;
  label: string;
}

export interface PlanningStageDoneEvent {
  type: "stage-done";
  agent: PlanningAgentKey;
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
  label: string;
  status: "running" | "done";
  model?: string;
  response?: string;
}
