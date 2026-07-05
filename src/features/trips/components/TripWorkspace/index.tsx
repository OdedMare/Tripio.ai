"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Compass, Sparkles, UserRound } from "lucide-react";
import { useTripStore } from "@/store/trip.store";
import { TripTabs } from "@/features/trips/components/TripTabs";
import { TripHeroCard } from "@/features/trips/components/TripHeroCard";
import { OverviewTab } from "@/features/trips/components/OverviewTab";
import { TimelineTab } from "@/features/trips/components/TimelineTab";
import { HotelsTab } from "@/features/hotels/components/HotelsTab";
import { RestaurantsTab } from "@/features/restaurants/components/RestaurantsTab";
import { AttractionsTab } from "@/features/attractions/components/AttractionsTab";
import { MapTab } from "@/features/map/components/MapTab";
import { ProfileTab } from "@/features/profile/components/ProfileTab";
import type { TripTab } from "@/types/trip.types";

export function TripWorkspace() {
  const router = useRouter();
  const { selectedTrip, currentTripId, activeTab, setActiveTab, createTrip, isLoading } = useTripStore();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!currentTripId) {
      return;
    }
    router.replace(`/trips/${currentTripId}`);
  }, [currentTripId, router]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "timeline":
        return <TimelineTab />;
      case "hotels":
        return <HotelsTab />;
      case "restaurants":
        return <RestaurantsTab />;
      case "attractions":
        return <AttractionsTab />;
      case "map":
        return <MapTab />;
      case "profile":
        return <ProfileTab />;
      case "overview":
      default:
        return <OverviewTab />;
    }
  }, [activeTab]);

  const handleCreateTrip = async () => {
    if (!prompt.trim()) {
      return;
    }
    await createTrip(prompt.trim());
    setPrompt("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-violet-200/70 bg-gradient-to-br from-violet-950 via-violet-900 to-fuchsia-900 p-6 text-white shadow-[0_30px_90px_-30px_rgba(109,40,217,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200">
              <Sparkles size={16} />
              Tripio agent
            </p>
            <h3 className="text-3xl font-semibold tracking-tight">Let&apos;s build your next escape.</h3>
            <p className="mt-2 text-sm text-violet-100/90">Start with a few details and I&apos;ll shape a calm, premium itinerary around your mood.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-violet-50">
            <div className="flex items-center gap-2">
              <Compass size={16} />
              Conversation-first planning
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="mb-4 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">A</div>
              Tripio
            </div>
            <p className="leading-7">I&apos;m ready to design a trip that feels effortless, thoughtful, and beautifully paced. Tell me where you want to go, what you love, and how you want to feel.</p>
          </div>

          <div className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-slate-950/20 p-3 md:flex-row md:items-center">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe your dream vacation…"
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/95 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleCreateTrip}
              disabled={isLoading}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Planning..." : "Start planning"}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {selectedTrip ? (
        <>
          <TripHeroCard trip={selectedTrip} />
          <TripTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 lg:p-6">{tabContent}</div>
        </>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <UserRound size={18} />
          </div>
          <p className="text-lg font-semibold text-slate-900">A fresh planning canvas awaits</p>
          <p className="mt-2 text-sm text-slate-500">Create a trip to open the workspace and see the premium experience unfold.</p>
        </div>
      )}
    </div>
  );
}
