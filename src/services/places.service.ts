import type { PlaceSuggestion } from "@/types/places.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL ?? "http://localhost:8000";

export const placesService = {
  async autocomplete(query: string): Promise<PlaceSuggestion[]> {
    const response = await fetch(`${BACKEND_URL}/places/autocomplete?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Places autocomplete request failed with ${response.status}`);
    }
    return (await response.json()) as PlaceSuggestion[];
  },
};
