"use client";

import type { TripTab } from "@/types/trip.types";

interface TripTabsProps {
  activeTab: TripTab;
  onChange: (tab: TripTab) => void;
}

const tabs: Array<{ key: TripTab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "timeline", label: "Timeline" },
  { key: "hotels", label: "Hotels" },
  { key: "restaurants", label: "Restaurants" },
  { key: "attractions", label: "Attractions" },
  { key: "map", label: "Map" },
  { key: "profile", label: "Profile" },
];

export function TripTabs({ activeTab, onChange }: TripTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
