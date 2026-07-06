import type { PlaceDetail, PlaceSuggestion } from "@/types/places.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL ?? "http://localhost:8000";

export const placesService = {
  async autocomplete(query: string): Promise<PlaceSuggestion[]> {
    const response = await fetch(`${BACKEND_URL}/places/autocomplete?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Places autocomplete request failed with ${response.status}`);
    }
    return (await response.json()) as PlaceSuggestion[];
  },

  async getAttractions(destination: string): Promise<PlaceDetail[]> {
    const response = await fetch(`${BACKEND_URL}/places/attractions?destination=${encodeURIComponent(destination)}`);
    if (!response.ok) {
      throw new Error(`Places attractions request failed with ${response.status}`);
    }
    return (await response.json()) as PlaceDetail[];
  },

  async getRestaurants(destination: string): Promise<PlaceDetail[]> {
    const response = await fetch(`${BACKEND_URL}/places/restaurants?destination=${encodeURIComponent(destination)}`);
    if (!response.ok) {
      throw new Error(`Places restaurants request failed with ${response.status}`);
    }
    return (await response.json()) as PlaceDetail[];
  },
};
