import type { TripPlan } from "@/types/planning.types";

function toCoordinateOrName(name: string, latitude: number | null, longitude: number | null): string {
  return latitude !== null && longitude !== null ? `${latitude},${longitude}` : name;
}

/**
 * Builds a Google Maps directions URL chaining the top hotel through each
 * attraction as waypoints — no API key required, opens in the browser/app.
 */
export function buildTripMapsUrl(plan: TripPlan): string {
  const stops: string[] = [];

  const primaryHotel = plan.hotels[0];
  if (primaryHotel) {
    stops.push(toCoordinateOrName(primaryHotel.name, primaryHotel.latitude, primaryHotel.longitude));
  }

  for (const attraction of plan.attractions) {
    stops.push(toCoordinateOrName(attraction.name, attraction.latitude, attraction.longitude));
  }

  if (stops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.destination)}`;
  }

  if (stops.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`;
  }

  const origin = stops[0];
  const finalDestination = stops[stops.length - 1];
  const waypoints = stops.slice(1, -1);

  const params = new URLSearchParams({
    api: "1",
    origin,
    destination: finalDestination,
  });

  if (waypoints.length > 0) {
    params.set("waypoints", waypoints.join("|"));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
