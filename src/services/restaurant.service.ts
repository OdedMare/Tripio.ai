import { mockRestaurants } from "@/mock/trip.mock";
import type { Restaurant } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const restaurantService = {
  async getRestaurants(): Promise<Restaurant[]> {
    await delay();
    return mockRestaurants.map((restaurant) => ({ ...restaurant }));
  },
};
