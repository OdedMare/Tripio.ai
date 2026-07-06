"use client";

import { BedDouble } from "lucide-react";
import { useTripStore } from "@/store/trip.store";

export function HotelsTab() {
  const { hotels } = useTripStore();

  if (hotels.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <BedDouble size={18} />
        </div>
        <p className="text-lg font-semibold text-slate-900">No hotels yet</p>
        <p className="mt-2 text-sm text-slate-500">Hotel picks will appear here once the Hotel Agent has recommendations for this trip.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">{hotel.name}</h4>
              <p className="text-sm text-slate-500">{hotel.location}</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">★ {hotel.rating}</div>
          </div>
          <p className="text-sm leading-7 text-slate-600">{hotel.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {hotel.amenities.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
