"use client";

import { MapPin, Navigation } from "lucide-react";

export function MapTab() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Map placeholder</p>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">Route inspiration board</h4>
        </div>
        <div className="rounded-full bg-slate-100 p-3 text-slate-700">
          <Navigation size={18} />
        </div>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-[radial-gradient(circle_at_top,_rgba(226,232,240,0.7),_transparent_55%)] p-8 text-center">
        <div className="mb-3 rounded-full bg-slate-900 p-4 text-white">
          <MapPin size={22} />
        </div>
        <p className="text-lg font-semibold text-slate-900">Map integration is reserved for Stage 2.</p>
        <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">This first stage focuses on a polished planning experience with a visual placeholder that sets up the future map experience cleanly.</p>
      </div>
    </div>
  );
}
