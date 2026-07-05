"use client";

import { useTripStore } from "@/store/trip.store";

export function OverviewTab() {
  const { selectedTrip } = useTripStore();

  if (!selectedTrip) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Trip summary</p>
        <h4 className="mt-2 text-xl font-semibold text-slate-900">{selectedTrip.summary}</h4>
        <p className="mt-3 text-sm leading-7 text-slate-600">This workspace is designed to feel calm and polished, with tabs for each planning domain and a premium AI-style input at the top.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">What this stage includes</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Responsive shell with conversation-style sidebar</li>
            <li>• Mocked async services and Zustand-powered state</li>
            <li>• Feature-based tabs for hotels, restaurants, attractions, map, and profile</li>
          </ul>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Planned next steps</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Richer detail panels and itinerary cards</li>
            <li>• More polished empty states and loading skeletons</li>
            <li>• Deeper interactions and visual storytelling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
