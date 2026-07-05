"use client";

import { useTripStore } from "@/store/trip.store";

export function TimelineTab() {
  const { selectedTrip } = useTripStore();

  if (!selectedTrip) {
    return null;
  }

  return (
    <div className="space-y-3">
      {selectedTrip.days.map((day) => (
        <div key={day.dayNumber} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Day {day.dayNumber}</p>
              <h4 className="mt-1 text-lg font-semibold text-slate-900">{day.title}</h4>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{day.focus}</div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{day.notes}</p>
        </div>
      ))}
    </div>
  );
}
