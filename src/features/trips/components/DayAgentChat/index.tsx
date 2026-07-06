"use client";

import { useState } from "react";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { planningService } from "@/services/planning.service";
import { useTripStore } from "@/store/trip.store";
import type { RefinedDayPlan } from "@/types/planning.types";
import type { Trip, TripDay } from "@/types/trip.types";

interface DayAgentChatProps {
  trip: Trip;
  day: TripDay;
  onClose: () => void;
}

function generatePlaceId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DayAgentChat({ trip, day, onClose }: DayAgentChatProps) {
  const updateTrip = useTripStore((state) => state.updateTrip);
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [changeSummary, setChangeSummary] = useState<string | null>(null);

  const applyRefinedDay = async (refined: RefinedDayPlan) => {
    const otherAttractions = trip.attractions.filter((item) => item.dayNumber !== day.dayNumber);
    const otherRestaurants = trip.restaurants.filter((item) => item.dayNumber !== day.dayNumber);

    await updateTrip({
      ...trip,
      attractions: [
        ...otherAttractions,
        ...refined.attractions.map((attraction) => ({
          id: generatePlaceId("attraction"),
          name: attraction.name,
          location: day.title,
          category: attraction.category,
          rating: 4.5,
          image: trip.image,
          description: attraction.description,
          estimatedVisitDuration: attraction.estimatedVisitDuration,
          latitude: attraction.latitude,
          longitude: attraction.longitude,
          dayNumber: day.dayNumber,
        })),
      ],
      restaurants: [
        ...otherRestaurants,
        ...refined.restaurants.map((restaurant) => ({
          id: generatePlaceId("restaurant"),
          name: restaurant.name,
          location: restaurant.area || day.title,
          cuisine: restaurant.cuisine,
          label: restaurant.label,
          summary: restaurant.summary,
          rating: restaurant.rating,
          priceRange: restaurant.priceRange,
          image: trip.image,
          description: restaurant.description,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          dayNumber: day.dayNumber,
        })),
      ],
    });
  };

  const handleSubmit = async () => {
    const trimmed = instruction.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(false);
    setChangeSummary(null);

    try {
      const refined = await planningService.refineDay({
        city: day.title,
        dayNumber: day.dayNumber,
        instruction: trimmed,
        attractions: trip.attractions
          .filter((item) => item.dayNumber === day.dayNumber)
          .map((item) => ({
            name: item.name,
            category: item.category,
            description: item.description,
            estimatedVisitDuration: item.estimatedVisitDuration ?? "",
            latitude: item.latitude ?? null,
            longitude: item.longitude ?? null,
          })),
        restaurants: trip.restaurants
          .filter((item) => item.dayNumber === day.dayNumber)
          .map((item) => ({
            name: item.name,
            area: item.location,
            cuisine: item.cuisine,
            label: item.label ?? "",
            summary: item.summary ?? "",
            rating: item.rating,
            priceRange: item.priceRange,
            description: item.description,
            latitude: item.latitude ?? null,
            longitude: item.longitude ?? null,
          })),
      });

      await applyRefinedDay(refined);
      setChangeSummary(refined.changeSummary);
      setInstruction("");
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-900">
          <Sparkles size={14} className="text-indigo-500" />
          Adjust day {day.dayNumber} with AI
        </p>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          rows={2}
          placeholder={`Tell me what to change on day ${day.dayNumber} — e.g. "make it more relaxed", "swap the museum for a market", "add a vegan dinner"...`}
          className="min-h-[3rem] flex-1 resize-none rounded-xl border border-indigo-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isLoading || instruction.trim().length === 0}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40"
          aria-label="Send change request"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      {isLoading && (
        <p className="mt-3 flex items-center gap-2 text-xs text-indigo-600">
          <Loader2 size={12} className="animate-spin" />
          The Day Editor agent is recalculating this day...
        </p>
      )}

      {changeSummary && !isLoading && (
        <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-emerald-700">✓ {changeSummary}</p>
      )}

      {error && !isLoading && (
        <p className="mt-3 text-xs text-rose-500">Couldn&apos;t update this day right now. Please try again.</p>
      )}
    </div>
  );
}
