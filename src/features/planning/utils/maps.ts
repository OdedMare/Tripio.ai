import type { Trip } from "@/types/trip.types";

function toCoordinateOrName(name: string, latitude?: number | null, longitude?: number | null): string {
  return latitude != null && longitude != null ? `${latitude},${longitude}` : name;
}

/**
 * Builds a Google Maps directions URL chaining each day's hotel and
 * attractions/restaurants, in day order — no API key required, opens in the
 * browser/app.
 */
export function buildTripMapsUrl(trip: Trip): string {
  const stops: string[] = [];

  for (const day of trip.days) {
    const dayHotel = trip.hotels.find((hotel) => (hotel.dayStart ?? 0) <= day.dayNumber && day.dayNumber <= (hotel.dayEnd ?? 0));
    if (dayHotel && !stops.includes(toCoordinateOrName(dayHotel.name, dayHotel.latitude, dayHotel.longitude))) {
      stops.push(toCoordinateOrName(dayHotel.name, dayHotel.latitude, dayHotel.longitude));
    }
    for (const attraction of trip.attractions.filter((item) => item.dayNumber === day.dayNumber)) {
      stops.push(toCoordinateOrName(attraction.name, attraction.latitude, attraction.longitude));
    }
    for (const restaurant of trip.restaurants.filter((item) => item.dayNumber === day.dayNumber)) {
      stops.push(toCoordinateOrName(restaurant.name, restaurant.latitude, restaurant.longitude));
    }
  }

  if (stops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.title)}`;
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
