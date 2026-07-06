"use client";

import { CalendarPlus, MapPin, Plane, Sparkles, Star, TrainFront } from "lucide-react";
import { downloadTripIcs } from "@/features/planning/utils/calendar";
import { buildTripMapsUrl } from "@/features/planning/utils/maps";
import type { AttractionSuggestion, CityPlan, TripPlan } from "@/types/planning.types";

interface TripPlanResultProps {
  plan: TripPlan;
}

export function TripPlanResult({ plan }: TripPlanResultProps) {
  const mapsUrl = buildTripMapsUrl(plan);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_#f4f4f5_55%,_#ece7e1)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Sparkles size={16} />
            <p className="text-sm font-medium">Your trip plan is ready</p>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">{plan.destination}</h1>
          {plan.dates && <p className="mt-1 text-sm text-slate-500">{plan.dates}</p>}
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.summary}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => downloadTripIcs(plan)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <CalendarPlus size={16} />
              Save to calendar
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <MapPin size={16} />
              Open in Google Maps
            </a>
          </div>
        </div>

        {plan.flights.length > 0 && (
          <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Plane size={18} />
              Flight options
            </h2>
            <div className="space-y-3">
              {plan.flights.map((flight, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{flight.airline}</p>
                    <p className="text-sm font-semibold text-slate-700">{flight.estimatedPriceRange}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{flight.route}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {flight.duration} · {flight.stops}
                  </p>
                  <p className="mt-2 text-xs italic text-slate-400">{flight.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {plan.itinerary.length > 0 && (
          <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Day-by-day itinerary</h2>
            <div className="space-y-6">
              {plan.itinerary.map((leg) => (
                <CityLeg key={leg.city} leg={leg} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function distributeAttractions(attractions: AttractionSuggestion[], days: number): AttractionSuggestion[][] {
  const buckets: AttractionSuggestion[][] = Array.from({ length: days }, () => []);
  attractions.forEach((attraction, index) => {
    buckets[index % days].push(attraction);
  });
  return buckets;
}

function CityLeg({ leg }: { leg: CityPlan }) {
  const dayBuckets = distributeAttractions(leg.attractions, leg.days);
  const primaryHotel = leg.hotels[0];

  return (
    <div>
      {leg.transportFromPrevious && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <TrainFront size={14} className="shrink-0 text-slate-400" />
          <span>
            <span className="font-semibold text-slate-700">{leg.transportFromPrevious.mode}</span> ·{" "}
            {leg.transportFromPrevious.duration} · {leg.transportFromPrevious.notes}
          </span>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">{leg.city}</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Day {leg.startDay}
          {leg.endDay !== leg.startDay ? `–${leg.endDay}` : ""}
        </span>
      </div>

      {primaryHotel && (
        <div className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">{primaryHotel.name}</p>
            <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              {primaryHotel.rating.toFixed(1)}
            </div>
          </div>
          <p className="text-xs text-slate-500">{primaryHotel.area}</p>
          <p className="mt-2 text-sm text-slate-600">{primaryHotel.description}</p>
          {primaryHotel.source === "google-places" && (
            <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">Verified via Google Places</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {dayBuckets.map((dayAttractions, index) => {
          const dayNumber = leg.startDay + index;
          return (
            <div key={dayNumber} className="rounded-2xl border border-slate-100 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Day {dayNumber}</p>
              {dayAttractions.length === 0 ? (
                <p className="text-sm text-slate-400">Free time to explore {leg.city}.</p>
              ) : (
                <div className="space-y-2">
                  {dayAttractions.map((attraction, attractionIndex) => (
                    <div key={attractionIndex} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">{attraction.name}</p>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm">
                          {attraction.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{attraction.description}</p>
                      <p className="mt-1 text-xs text-slate-400">{attraction.estimatedVisitDuration}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
