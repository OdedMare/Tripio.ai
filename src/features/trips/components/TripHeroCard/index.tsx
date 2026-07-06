"use client";

import Image from "next/image";
import { CalendarRange, Clock3, MapPin } from "lucide-react";
import type { Trip } from "@/types/trip.types";

interface TripHeroCardProps {
  trip: Trip;
}

export function TripHeroCard({ trip }: TripHeroCardProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-56 w-full">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
            {trip.location}
          </div>
          <h3 className="text-2xl font-semibold">{trip.title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-200">{trip.description}</p>
        </div>
      </div>
      <div className="grid gap-4 border-t border-slate-200 bg-slate-50/80 p-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarRange size={16} />
            Dates
          </div>
          <p className="text-sm text-slate-500">{trip.dates}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 size={16} />
            Duration
          </div>
          <p className="text-sm text-slate-500">{trip.duration}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin size={16} />
            Highlights
          </div>
          <p className="text-sm text-slate-500">{trip.highlights.join(" • ")}</p>
        </div>
      </div>
    </div>
  );
}
