import type { TravelProfile } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  async getProfile(): Promise<TravelProfile | null> {
    await delay();
    return null;
  },
};
