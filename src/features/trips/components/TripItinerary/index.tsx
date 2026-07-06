"use client";

import { useState } from "react";
import { CalendarPlus, MapPin, Plane, Plus, Sparkles, Star, Trash2, Utensils } from "lucide-react";
import { useTripStore } from "@/store/trip.store";
import { downloadTripIcs } from "@/features/planning/utils/calendar";
import { buildTripMapsUrl } from "@/features/planning/utils/maps";
import { AddPlaceDrawer } from "@/features/trips/components/AddPlaceDrawer";
import type { Trip, TripDay } from "@/types/trip.types";
import type { PlaceDetail } from "@/types/places.types";

interface TripItineraryProps {
  trip: Trip;
}

type OpenDrawer = { dayNumber: number; kind: "attraction" | "restaurant" } | null;

function generatePlaceId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TripItinerary({ trip }: TripItineraryProps) {
  const updateTrip = useTripStore((state) => state.updateTrip);
  const [openDrawer, setOpenDrawer] = useState<OpenDrawer>(null);

  const mapsUrl = buildTripMapsUrl(trip);

  const handleAddAttraction = (day: TripDay, place: PlaceDetail) => {
    void updateTrip({
      ...trip,
      attractions: [
        ...trip.attractions,
        {
          id: generatePlaceId("attraction"),
          name: place.name,
          location: day.title,
          category: place.types[0] ?? "Attraction",
          rating: place.rating,
          image: trip.image,
          description: place.summary ?? "",
          latitude: place.latitude,
          longitude: place.longitude,
          googleMapsUri: place.googleMapsUri,
          websiteUri: place.websiteUri,
          dayNumber: day.dayNumber,
        },
      ],
    });
    setOpenDrawer(null);
  };

  const handleAddRestaurant = (day: TripDay, place: PlaceDetail) => {
    void updateTrip({
      ...trip,
      restaurants: [
        ...trip.restaurants,
        {
          id: generatePlaceId("restaurant"),
          name: place.name,
          location: day.title,
          cuisine: place.types[0] ?? "Restaurant",
          rating: place.rating,
          priceRange: place.priceLevel ?? "—",
          image: trip.image,
          description: place.summary ?? "",
          latitude: place.latitude,
          longitude: place.longitude,
          googleMapsUri: place.googleMapsUri,
          websiteUri: place.websiteUri,
          dayNumber: day.dayNumber,
        },
      ],
    });
    setOpenDrawer(null);
  };

  const handleRemoveAttraction = (attractionId: string) => {
    void updateTrip({ ...trip, attractions: trip.attractions.filter((item) => item.id !== attractionId) });
  };

  const handleRemoveRestaurant = (restaurantId: string) => {
    void updateTrip({ ...trip, restaurants: trip.restaurants.filter((item) => item.id !== restaurantId) });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <Sparkles size={16} />
          <p className="text-sm font-medium">Your trip plan</p>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{trip.title}</h1>
        {trip.dates && <p className="mt-1 text-sm text-slate-500">{trip.dates}</p>}
        <p className="mt-3 text-sm leading-6 text-slate-600">{trip.summary}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => downloadTripIcs(trip)}
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

      {trip.flights.length > 0 && (
        <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Plane size={18} />
            Flight options
          </h2>
          <div className="space-y-3">
            {trip.flights.map((flight, index) => (
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {flight.googleFlightsUrl && (
                    <a
                      href={flight.googleFlightsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                      Search Google Flights
                    </a>
                  )}
                  {flight.skyscannerUrl && (
                    <a
                      href={flight.skyscannerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                      Search Skyscanner
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Day-by-day itinerary</h2>
        <div className="space-y-4">
          {trip.days.map((day) => {
            const hotel = trip.hotels.find((item) => (item.dayStart ?? 0) <= day.dayNumber && day.dayNumber <= (item.dayEnd ?? 0));
            const attractions = trip.attractions.filter((item) => item.dayNumber === day.dayNumber);
            const restaurants = trip.restaurants.filter((item) => item.dayNumber === day.dayNumber);
            const isFirstDayOfCity = trip.hotels.some((item) => item.dayStart === day.dayNumber) || day.dayNumber === trip.days[0]?.dayNumber;

            return (
              <div key={day.dayNumber} className="rounded-2xl border border-slate-100 p-4">
                {isFirstDayOfCity && hotel && (
                  <div className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{hotel.name}</p>
                      <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        {hotel.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{hotel.location}</p>
                    <p className="mt-2 text-sm text-slate-600">{hotel.description}</p>
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      >
                        Search on Booking.com
                      </a>
                    )}
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Day {day.dayNumber} · {day.title}
                  </p>
                  {day.notes && <p className="text-xs text-slate-400">{day.notes}</p>}
                </div>

                <div className="space-y-2">
                  {attractions.map((attraction) => (
                    <div key={attraction.id} className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 p-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">{attraction.name}</p>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm">
                            {attraction.category}
                          </span>
                        </div>
                        {attraction.description && <p className="mt-1 text-sm text-slate-600">{attraction.description}</p>}
                        {attraction.estimatedVisitDuration && <p className="mt-1 text-xs text-slate-400">{attraction.estimatedVisitDuration}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttraction(attraction.id)}
                        className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="flex items-start justify-between gap-2 rounded-xl bg-emerald-50/60 p-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Utensils size={13} className="text-emerald-600" />
                          <p className="text-sm font-semibold text-slate-800">{restaurant.name}</p>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm">
                            {restaurant.cuisine}
                          </span>
                        </div>
                        {restaurant.description && <p className="mt-1 text-sm text-slate-600">{restaurant.description}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRestaurant(restaurant.id)}
                        className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {attractions.length === 0 && restaurants.length === 0 && (
                    <p className="text-sm text-slate-400">Free time to explore {day.title}.</p>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenDrawer({ dayNumber: day.dayNumber, kind: "attraction" })}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Plus size={12} />
                    Add attraction
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDrawer({ dayNumber: day.dayNumber, kind: "restaurant" })}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Plus size={12} />
                    Add restaurant
                  </button>
                </div>

                {openDrawer?.dayNumber === day.dayNumber && (
                  <div className="mt-3">
                    <AddPlaceDrawer
                      title={openDrawer.kind === "attraction" ? `Add an attraction in ${day.title}` : `Add a restaurant in ${day.title}`}
                      destination={day.title}
                      kind={openDrawer.kind}
                      onAdd={(place) => (openDrawer.kind === "attraction" ? handleAddAttraction(day, place) : handleAddRestaurant(day, place))}
                      onClose={() => setOpenDrawer(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
