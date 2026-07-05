import { mockProfile } from "@/mock/trip.mock";
import type { TravelProfile } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  async getProfile(): Promise<TravelProfile> {
    await delay();
    return { ...mockProfile };
  },
};
