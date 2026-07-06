"use client";

import Link from "next/link";
import { ArrowRight, Compass, Mail, Sparkles } from "lucide-react";

export function NewTripChoice() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_#f4f4f5_55%,_#ece7e1)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-10 flex items-center gap-2 text-slate-500">
          <Sparkles size={16} />
          <p className="text-sm font-medium">How would you like to start planning?</p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          <Link
            href="/trips/new/destination"
            className="group flex flex-col rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur transition hover:border-slate-300"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Compass size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Start from scratch</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500">
              Tell us where you want to go, and we&apos;ll ask a few questions about your travel style to build a
              plan with flights, hotels, and attractions tailored to you.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900">
              Choose a destination
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/diagnosis"
            className="group flex flex-col rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] backdrop-blur transition hover:border-slate-300"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Import from Gmail</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500">
              Already booked a flight? Connect Gmail and we&apos;ll detect it, then build the rest of your trip —
              hotels and attractions — around it.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900">
              Connect Gmail
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
