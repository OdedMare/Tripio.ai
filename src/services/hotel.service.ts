import type { Hotel } from "@/types/trip.types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const hotelService = {
  async getHotels(): Promise<Hotel[]> {
    await delay();
    return [];
  },
};
