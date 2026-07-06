"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Star, X } from "lucide-react";
import { placesService } from "@/services/places.service";
import type { PlaceDetail } from "@/types/places.types";

interface AddPlaceDrawerProps {
  title: string;
  destination: string;
  kind: "attraction" | "restaurant";
  onAdd: (place: PlaceDetail) => void;
  onClose: () => void;
}

export function AddPlaceDrawer({ title, destination, kind, onAdd, onClose }: AddPlaceDrawerProps) {
  const [candidates, setCandidates] = useState<PlaceDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchCandidates = kind === "attraction" ? placesService.getAttractions : placesService.getRestaurants;

    void fetchCandidates(destination)
      .then((results) => {
        if (!cancelled) setCandidates(results);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [destination, kind]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-4 text-sm text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          Searching real places in {destination}...
        </div>
      )}

      {!isLoading && error && <p className="py-4 text-sm text-rose-500">Couldn&apos;t load suggestions right now.</p>}

      {!isLoading && !error && candidates.length === 0 && (
        <p className="py-4 text-sm text-slate-400">No results found for {destination}.</p>
      )}

      <div className="max-h-72 space-y-2 overflow-y-auto">
        {candidates.map((place) => (
          <button
            key={place.name}
            type="button"
            onClick={() => onAdd(place)}
            className="flex w-full items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-white"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{place.name}</p>
              <p className="truncate text-xs text-slate-500">{place.location}</p>
              {place.summary && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{place.summary}</p>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                {place.rating.toFixed(1)}
              </span>
              <span className="rounded-full bg-slate-900 p-1 text-white">
                <Plus size={12} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
