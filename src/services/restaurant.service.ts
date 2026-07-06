import type { Restaurant } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const restaurantService = {
  async getRestaurants(): Promise<Restaurant[]> {
    await delay();
    return [];
  },
};
