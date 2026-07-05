import { mockAttractions } from "@/mock/trip.mock";
import type { Attraction } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const attractionService = {
  async getAttractions(): Promise<Attraction[]> {
    await delay();
    return mockAttractions.map((attraction) => ({ ...attraction }));
  },
};
