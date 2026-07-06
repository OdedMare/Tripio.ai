"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useTripStore } from "@/store/trip.store";

export function ProfileTab() {
  const { profile } = useTripStore();

  if (!profile) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <UserRound size={18} />
        </div>
        <p className="text-lg font-semibold text-slate-900">No travel profile yet</p>
        <p className="mt-2 text-sm text-slate-500">Complete the travel style diagnosis to build your profile.</p>
        <Link
          href="/diagnosis"
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start diagnosis
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Travel profile</p>
        <h4 className="mt-2 text-xl font-semibold text-slate-900">Your ideal rhythm</h4>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-semibold text-slate-800">Pace</p>
            <p className="mt-1 capitalize">{profile.pace}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-semibold text-slate-800">Budget</p>
            <p className="mt-1 capitalize">{profile.preferredBudget}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-semibold text-slate-800">Stay style</p>
            <p className="mt-1">{profile.accommodationStyle}</p>
          </div>
        </div>
      </div>
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Interests</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span key={interest} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{interest}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
