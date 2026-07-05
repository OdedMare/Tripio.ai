"use client";

import { useTripStore } from "@/store/trip.store";

export function RestaurantsTab() {
  const { restaurants } = useTripStore();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">{restaurant.name}</h4>
              <p className="text-sm text-slate-500">{restaurant.location}</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">★ {restaurant.rating}</div>
          </div>
          <p className="text-sm leading-7 text-slate-600">{restaurant.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{restaurant.cuisine}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{restaurant.priceRange}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
