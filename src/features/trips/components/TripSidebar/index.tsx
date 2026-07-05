"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";
import type { Trip } from "@/types/trip.types";

interface TripSidebarProps {
  trips: Trip[];
  currentTripId: string | null;
}

export function TripSidebar({ trips, currentTripId }: TripSidebarProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-slate-700">Recent trips</p>
        <span className="text-xs text-slate-500">{trips.length}</span>
      </div>
      <div className="space-y-2">
        {trips.map((trip) => {
          const isActive = trip.id === currentTripId;
          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className={`flex items-start justify-between rounded-2xl border px-3 py-3 transition ${
                isActive ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{trip.title}</p>
                <p className={`mt-1 text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>{trip.location}</p>
              </div>
              <div className={`rounded-full p-2 ${isActive ? "bg-white/15" : "bg-slate-100"}`}>
                {isActive ? <ArrowRight size={14} /> : <MessageSquareText size={14} />}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Sparkles size={16} />
          Stage 1 foundation
        </div>
        <p className="text-sm text-slate-500">Mocked planning flows, premium visuals, and a scalable feature-first structure.</p>
      </div>
    </div>
  );
}
