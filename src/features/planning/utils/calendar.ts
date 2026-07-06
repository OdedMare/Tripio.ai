import type { Trip } from "@/types/trip.types";

function escapeIcsText(value: string): string {
  return value.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatIcsAllDay(date: Date): string {
  return date.toISOString().split("T")[0].replace(/-/g, "");
}

function parseTripStartDate(dates: string): Date | null {
  const match = dates.match(/(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  const parsed = new Date(match[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function buildDayDescription(trip: Trip, dayNumber: number): string {
  const attractions = trip.attractions.filter((item) => item.dayNumber === dayNumber);
  const restaurants = trip.restaurants.filter((item) => item.dayNumber === dayNumber);
  const hotel = trip.hotels.find((item) => (item.dayStart ?? 0) <= dayNumber && dayNumber <= (item.dayEnd ?? 0));

  const lines: string[] = [];
  if (hotel) lines.push(`Stay: ${hotel.name}`);
  if (attractions.length > 0) {
    lines.push("Attractions:");
    attractions.forEach((attraction) => lines.push(`  - ${attraction.name}${attraction.estimatedVisitDuration ? ` (${attraction.estimatedVisitDuration})` : ""}`));
  }
  if (restaurants.length > 0) {
    lines.push("Dining:");
    restaurants.forEach((restaurant) => lines.push(`  - ${restaurant.name} (${restaurant.cuisine})`));
  }
  return lines.join("\n");
}

export function buildTripIcs(trip: Trip): string {
  const now = formatIcsDate(new Date());
  const startDate = parseTripStartDate(trip.dates);

  const events: string[] = [];

  if (trip.days.length > 0 && startDate) {
    trip.days.forEach((day, index) => {
      const dayDate = addDays(startDate, index);
      const nextDate = addDays(startDate, index + 1);
      const description = buildDayDescription(trip, day.dayNumber);

      events.push(
        [
          "BEGIN:VEVENT",
          `UID:tripio-${Date.now()}-day${day.dayNumber}@tripio.ai`,
          `DTSTAMP:${now}`,
          `DTSTART;VALUE=DATE:${formatIcsAllDay(dayDate)}`,
          `DTEND;VALUE=DATE:${formatIcsAllDay(nextDate)}`,
          `SUMMARY:${escapeIcsText(`Day ${day.dayNumber}: ${day.title}`)}`,
          `DESCRIPTION:${escapeIcsText(description || day.notes || trip.summary)}`,
          `LOCATION:${escapeIcsText(day.title)}`,
          "END:VEVENT",
        ].join("\r\n"),
      );
    });
  } else {
    const itineraryLines = [
      ...trip.hotels.slice(0, 1).map((hotel) => `Stay: ${hotel.name} (${hotel.location})`),
      trip.attractions.length > 0 ? "Planned attractions:" : "",
      ...trip.attractions.map((attraction) => `- ${attraction.name}`),
    ];
    const description = [trip.summary, ...itineraryLines].filter(Boolean).join("\n");

    events.push(
      [
        "BEGIN:VEVENT",
        `UID:tripio-${Date.now()}@tripio.ai`,
        `DTSTAMP:${now}`,
        `SUMMARY:${escapeIcsText(`Trip to ${trip.title}`)}`,
        `DESCRIPTION:${escapeIcsText(description)}`,
        `LOCATION:${escapeIcsText(trip.title)}`,
        "END:VEVENT",
      ].join("\r\n"),
    );
  }

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Tripio//Trip Plan//EN", ...events, "END:VCALENDAR"].join("\r\n");
}

export function downloadTripIcs(trip: Trip): void {
  const ics = buildTripIcs(trip);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `trip-${trip.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
