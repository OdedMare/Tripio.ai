"use client";

import { useEffect, useRef, useState } from "react";
import { placesService } from "@/services/places.service";
import type { PlaceSuggestion } from "@/types/places.types";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

interface PlaceAutocompleteInputProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function PlaceAutocompleteInput({ id, value, placeholder, onChange }: PlaceAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = value.trim();
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (query.length < MIN_QUERY_LENGTH) {
        if (!cancelled) setSuggestions([]);
        return;
      }

      void placesService
        .autocomplete(query)
        .then((results) => {
          if (!cancelled) setSuggestions(results);
        })
        .catch(() => {
          if (!cancelled) setSuggestions([]);
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)]">
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <button
                type="button"
                onClick={() => {
                  onChange(suggestion.text);
                  setSuggestions([]);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {suggestion.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
