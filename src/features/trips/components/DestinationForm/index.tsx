"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useTripIntentStore } from "@/store/tripIntent.store";
import { PlaceAutocompleteInput } from "@/features/trips/components/PlaceAutocompleteInput";

const DURATION_PRESETS = [
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
];

function toDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function DestinationForm() {
  const router = useRouter();
  const setIntent = useTripIntentStore((state) => state.setIntent);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const canContinue = destination.trim().length > 0;

  const applyDurationPreset = (days: number) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);

    setStartDate(toDateInputValue(start));
    setEndDate(toDateInputValue(end));
  };

  const handleContinue = () => {
    if (!canContinue) return;

    const dates = startDate && endDate ? `${startDate} to ${endDate}` : null;
    const totalDays =
      startDate && endDate
        ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : null;

    setIntent({
      source: "scratch",
      origin: origin.trim() || null,
      destination: destination.trim(),
      dates,
      totalDays: totalDays && totalDays > 0 ? totalDays : null,
      includeFlights: true,
    });

    router.push("/diagnosis");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_#f4f4f5_55%,_#ece7e1)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-10 flex items-center gap-2 text-slate-500">
          <Sparkles size={16} />
          <p className="text-sm font-medium">Let&apos;s start with the basics.</p>
        </div>

        <div className="w-full rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <MapPin size={20} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Where do you want to go?</h2>
          <p className="mt-2 text-sm text-slate-500">Add your destination and travel dates so we can plan around them.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="origin" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                From
              </label>
              <PlaceAutocompleteInput id="origin" value={origin} onChange={setOrigin} placeholder="Tel Aviv, Israel" />
            </div>

            <div>
              <label htmlFor="destination" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Destination
              </label>
              <PlaceAutocompleteInput id="destination" value={destination} onChange={setDestination} placeholder="Kyoto, Japan" />
            </div>

            <div>
              <p className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trip length</p>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyDurationPreset(preset.days)}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="start-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Start date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  End date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  min={startDate || undefined}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-slate-400"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400">Dates are optional — you can plan a trip without fixed dates yet.</p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to travel style questions
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
