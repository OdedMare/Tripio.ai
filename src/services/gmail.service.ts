import type { DetectedTrip, GmailConnectionStatus } from "@/types/gmail.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL ?? "http://localhost:8000";

export const gmailService = {
  getConnectUrl(): string {
    return `${BACKEND_URL}/auth/gmail/login`;
  },

  async getStatus(): Promise<GmailConnectionStatus> {
    const response = await fetch(`${BACKEND_URL}/gmail/status`);
    if (!response.ok) {
      throw new Error(`Gmail status request failed with ${response.status}`);
    }
    return (await response.json()) as GmailConnectionStatus;
  },

  async getDetectedTrips(): Promise<DetectedTrip[]> {
    const response = await fetch(`${BACKEND_URL}/gmail/trips`);
    if (!response.ok) {
      throw new Error(`Gmail trips request failed with ${response.status}`);
    }
    return (await response.json()) as DetectedTrip[];
  },
};
