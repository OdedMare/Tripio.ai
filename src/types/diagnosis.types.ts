import type { TravelProfile } from "@/types/trip.types";

export type TravelerType =
  | "explorer"
  | "relaxer"
  | "culture-seeker"
  | "foodie"
  | "thrill-seeker"
  | "connector";

export type ComfortLevel = "backpacker" | "comfortable" | "premium" | "luxury";

export type PlanningStyle = "fully-planned" | "loosely-planned" | "spontaneous";

export interface DiagnosisOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  traits: Partial<{
    travelerType: TravelerType;
    pace: TravelProfile["pace"];
    comfortLevel: ComfortLevel;
    planningStyle: PlanningStyle;
    preferredBudget: TravelProfile["preferredBudget"];
    interests: string[];
    dealbreakers: string[];
    hotelStyle: string;
    foodStyle: string;
    transportStyle: string;
  }>;
}

export interface DiagnosisQuestion {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  options: DiagnosisOption[];
}

export interface DiagnosisAnswer {
  questionId: string;
  optionId: string;
}

export interface TravelDiagnosisProfile extends TravelProfile {
  travelerType: TravelerType;
  comfortLevel: ComfortLevel;
  planningStyle: PlanningStyle;
  dealbreakers: string[];
  hotelStyle: string;
  foodStyle: string;
  transportStyle: string;
  summary: string;
}
