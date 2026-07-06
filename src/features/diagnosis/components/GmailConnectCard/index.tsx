"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { gmailService } from "@/services/gmail.service";
import type { DetectedTrip } from "@/types/gmail.types";

interface GmailConnectCardProps {
  onContinue: () => void;
}

type TripsFetchState = "idle" | "loaded" | "error";

export function GmailConnectCard({ onContinue }: GmailConnectCardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [tripsFetchState, setTripsFetchState] = useState<TripsFetchState>("idle");
  const [trips, setTrips] = useState<DetectedTrip[]>([]);

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

  const handleConnect = () => {
    window.location.href = gmailService.getConnectUrl();
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
            If you have upcoming trips already booked, connecting Gmail lets us spot them and tailor questions around
            what you&apos;ve already planned. This is optional — we only read booking-related emails.
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
          <p className="mt-2 text-sm text-slate-500">Here&apos;s what we found in your inbox.</p>

          <div className="mt-4 space-y-2">
            {isLoadingTrips && <p className="text-sm text-slate-400">Scanning your inbox...</p>}
            {tripsFetchState === "error" && <p className="text-sm text-rose-500">Couldn&apos;t read your inbox right now.</p>}
            {tripsFetchState === "loaded" && trips.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming trips found in your inbox.</p>
            )}
            {trips.map((trip, index) => (
              <div
                key={`${trip.sourceSubject}-${index}`}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="mt-0.5 rounded-xl bg-white p-2 text-slate-600 shadow-sm">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{trip.destination ?? "Unknown destination"}</p>
                  <p className="text-xs text-slate-500">{trip.dates ?? "Dates not specified"}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{trip.sourceSubject}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue to travel style questions
          </button>
        </>
      )}
    </div>
  );
}
