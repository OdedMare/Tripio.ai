import type { TripPlan } from "@/types/planning.types";

function escapeIcsText(value: string): string {
  return value.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildTripIcs(plan: TripPlan): string {
  const now = formatIcsDate(new Date());
  const uid = `tripio-${Date.now()}@tripio.ai`;

  const hotelLines = plan.hotels.slice(0, 1).map((hotel) => `Stay: ${hotel.name} (${hotel.area})`);
  const attractionLines = plan.attractions.map((attraction) => `- ${attraction.name} (${attraction.estimatedVisitDuration})`);

  const description = [
    plan.summary,
    ...hotelLines,
    attractionLines.length > 0 ? "Planned attractions:" : "",
    ...attractionLines,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tripio//Trip Plan//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${escapeIcsText(`Trip to ${plan.destination}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(plan.destination)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadTripIcs(plan: TripPlan): void {
  const ics = buildTripIcs(plan);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `trip-${plan.destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
