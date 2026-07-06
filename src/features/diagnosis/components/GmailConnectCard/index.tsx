"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Plane } from "lucide-react";
import { gmailService } from "@/services/gmail.service";
import { useTripIntentStore } from "@/store/tripIntent.store";
import { TravelLoadingIcon } from "@/features/diagnosis/components/TravelLoadingIcon";
import type { DetectedTrip } from "@/types/gmail.types";

interface GmailConnectCardProps {
  onContinue: () => void;
}

type TripsFetchState = "idle" | "loaded" | "error";

export function GmailConnectCard({ onContinue }: GmailConnectCardProps) {
  const setIntent = useTripIntentStore((state) => state.setIntent);

  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [tripsFetchState, setTripsFetchState] = useState<TripsFetchState>("idle");
  const [trips, setTrips] = useState<DetectedTrip[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justConnected = params.get("gmail") === "connected";

    gmailService
      .getStatus()
      .then((status) => setIsConnected(status.connected || justConnected))
      .catch(() => setIsConnected(false))
      .finally(() => setIsCheckingStatus(false));
  }, []);

  useEffect(() => {
    if (!isConnected || tripsFetchState !== "idle") return;

    let cancelled = false;

    void gmailService
      .getDetectedTrips()
      .then((result) => {
        if (cancelled) return;
        setTrips(result);
        setTripsFetchState("loaded");
      })
      .catch(() => {
        if (!cancelled) setTripsFetchState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isConnected, tripsFetchState]);

  const isLoadingTrips = isConnected && tripsFetchState === "idle";
  const flights = trips.filter((trip) => trip.isFlight);

  const handleConnect = () => {
    window.location.href = gmailService.getConnectUrl();
  };

  const handleSelectFlight = (trip: DetectedTrip, index: number) => {
    if (!trip.destination) return;
    setSelectedIndex(index);
    setIntent({
      source: "gmail",
      destination: trip.destination,
      dates: trip.dates,
      includeFlights: false,
    });
    onContinue();
  };

  return (
    <div className="w-full max-w-xl rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur animate-fade-in-up">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Mail size={20} />
      </div>

      {!isConnected ? (
        <>
          <h2 className="text-2xl font-semibold text-slate-900">Connect Gmail</h2>
          <p className="mt-2 text-sm text-slate-500">
            If you have a flight already booked, connecting Gmail lets us spot it and build your hotel and
            attraction picks around it. This is optional — we only read booking-related emails.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleConnect}
              disabled={isCheckingStatus}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Connect Gmail
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Skip for now
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-slate-900">Gmail connected</h2>
          <p className="mt-2 text-sm text-slate-500">Pick a flight to plan your trip around.</p>

          <div className="mt-4 space-y-2">
            {isLoadingTrips && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TravelLoadingIcon size={14} />
                Scanning your inbox for flights...
              </div>
            )}
            {tripsFetchState === "error" && <p className="text-sm text-rose-500">Couldn&apos;t read your inbox right now.</p>}
            {tripsFetchState === "loaded" && flights.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming flights found in your inbox.</p>
            )}
            {flights.map((trip, index) => {
              const isSelected = selectedIndex === index;

              return (
                <button
                  type="button"
                  key={`${trip.sourceSubject}-${index}`}
                  onClick={() => handleSelectFlight(trip, index)}
                  disabled={!trip.destination}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSelected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className={`mt-0.5 rounded-xl p-2 shadow-sm ${isSelected ? "bg-white/15 text-white" : "bg-white text-slate-600"}`}>
                    <Plane size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin size={12} />
                      {trip.destination ?? "Unknown destination"}
                    </p>
                    <p className={`text-xs ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                      {trip.dates ?? "Dates not specified"}
                    </p>
                    <p className={`mt-1 truncate text-xs ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{trip.sourceSubject}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Skip and continue without a flight
          </button>
        </>
      )}
    </div>
  );
}
