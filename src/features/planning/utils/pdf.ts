import type { Trip } from "@/types/trip.types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function chip(text: string): string {
  return `<span class="chip">${escapeHtml(text)}</span>`;
}

function buildDaySection(trip: Trip, dayNumber: number, title: string, notes: string): string {
  const hotel = trip.hotels.find((item) => (item.dayStart ?? 0) <= dayNumber && dayNumber <= (item.dayEnd ?? 0));
  const attractions = trip.attractions.filter((item) => item.dayNumber === dayNumber);
  const restaurants = trip.restaurants.filter((item) => item.dayNumber === dayNumber);
  const isFirstDayOfCity = trip.hotels.some((item) => item.dayStart === dayNumber);

  const hotelBlock =
    isFirstDayOfCity && hotel
      ? `<div class="item hotel">
          <p class="item-title">🏨 ${escapeHtml(hotel.name)} <span class="muted">· ${escapeHtml(hotel.location)} · ★ ${hotel.rating.toFixed(1)}</span></p>
          ${hotel.description ? `<p class="item-desc">${escapeHtml(hotel.description)}</p>` : ""}
        </div>`
      : "";

  const attractionBlocks = attractions
    .map(
      (attraction) => `<div class="item">
        <p class="item-title">📍 ${escapeHtml(attraction.name)} ${chip(attraction.category)}</p>
        ${attraction.description ? `<p class="item-desc">${escapeHtml(attraction.description)}</p>` : ""}
        ${attraction.estimatedVisitDuration ? `<p class="muted small">${escapeHtml(attraction.estimatedVisitDuration)}</p>` : ""}
      </div>`,
    )
    .join("");

  const restaurantBlocks = restaurants
    .map(
      (restaurant) => `<div class="item restaurant">
        <p class="item-title">🍽️ ${escapeHtml(restaurant.name)} ${restaurant.label ? chip(restaurant.label) : ""} ${chip(restaurant.cuisine)}</p>
        ${restaurant.summary ? `<p class="item-summary">${escapeHtml(restaurant.summary)}</p>` : ""}
        ${restaurant.description ? `<p class="item-desc">${escapeHtml(restaurant.description)}</p>` : ""}
        <p class="muted small">${escapeHtml(restaurant.priceRange)}${restaurant.rating ? ` · ★ ${restaurant.rating.toFixed(1)}` : ""}</p>
      </div>`,
    )
    .join("");

  const empty =
    attractions.length === 0 && restaurants.length === 0 ? `<p class="muted">Free time to explore ${escapeHtml(title)}.</p>` : "";

  return `<section class="day">
    <h2>Day ${dayNumber} · ${escapeHtml(title)}</h2>
    ${notes ? `<p class="muted small">${escapeHtml(notes)}</p>` : ""}
    ${hotelBlock}
    ${attractionBlocks}
    ${restaurantBlocks}
    ${empty}
  </section>`;
}

export function buildTripPdfHtml(trip: Trip): string {
  const flightsBlock =
    trip.flights.length > 0
      ? `<section class="day">
          <h2>✈️ Flight options</h2>
          ${trip.flights
            .map(
              (flight) => `<div class="item">
                <p class="item-title">${escapeHtml(flight.airline)} <span class="muted">· ${escapeHtml(flight.estimatedPriceRange)}</span></p>
                <p class="item-desc">${escapeHtml(flight.route)} — ${escapeHtml(flight.duration)} · ${escapeHtml(flight.stops)}</p>
              </div>`,
            )
            .join("")}
        </section>`
      : "";

  const daySections = trip.days.map((day) => buildDaySection(trip, day.dayNumber, day.title, day.notes)).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(trip.title)} — Tripio trip plan</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #0f172a; padding: 32px; line-height: 1.5; }
  header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 26px; }
  .dates { color: #64748b; margin-top: 4px; }
  .summary { margin-top: 10px; font-size: 14px; color: #334155; }
  .day { margin-bottom: 20px; break-inside: avoid; }
  h2 { font-size: 16px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .item { margin: 8px 0; padding: 8px 12px; background: #f8fafc; border-radius: 8px; }
  .item.restaurant { background: #ecfdf5; }
  .item.hotel { background: #eff6ff; }
  .item-title { font-size: 13px; font-weight: 600; }
  .item-summary { font-size: 12px; font-weight: 500; color: #334155; margin-top: 2px; }
  .item-desc { font-size: 12px; color: #475569; margin-top: 2px; }
  .chip { display: inline-block; font-size: 10px; font-weight: 600; color: #475569; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 1px 8px; vertical-align: middle; }
  .muted { color: #94a3b8; font-weight: 400; }
  .small { font-size: 11px; margin-top: 2px; }
  footer { margin-top: 28px; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(trip.title)}</h1>
    ${trip.dates ? `<p class="dates">${escapeHtml(trip.dates)} · ${escapeHtml(trip.duration)}</p>` : ""}
    ${trip.summary ? `<p class="summary">${escapeHtml(trip.summary)}</p>` : ""}
  </header>
  ${flightsBlock}
  ${daySections}
  <footer>Generated by Tripio · ${new Date().toLocaleDateString()}</footer>
</body>
</html>`;
}

export function exportTripPdf(trip: Trip): void {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(buildTripPdfHtml(trip));
  doc.close();

  const cleanup = () => {
    if (iframe.parentNode) document.body.removeChild(iframe);
  };

  iframe.contentWindow?.addEventListener("afterprint", cleanup);
  // Fallback for browsers that never fire afterprint on iframes.
  window.setTimeout(cleanup, 60_000);

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();
}
