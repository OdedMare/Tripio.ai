export interface GmailConnectionStatus {
  connected: boolean;
}

export interface DetectedTrip {
  destination: string | null;
  dates: string | null;
  confidence: "high" | "medium" | "low";
  sourceSubject: string;
  isFlight: boolean;
}
