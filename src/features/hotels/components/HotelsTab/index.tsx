"use client";

import { useTripStore } from "@/store/trip.store";

export function HotelsTab() {
  const { hotels } = useTripStore();

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
