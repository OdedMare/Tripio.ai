"use client";

import { useEffect, useState } from "react";
import { Plane, Sailboat, TrainFront, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Plane, TrainFront, Sailboat];
const CYCLE_MS = 600;

interface TravelLoadingIconProps {
  size?: number;
}

export function TravelLoadingIcon({ size = 12 }: TravelLoadingIconProps) {
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((index) => (index + 1) % ICONS.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  const Icon = ICONS[iconIndex];

  return (
    <span key={iconIndex} className="inline-flex animate-fade-in-up">
      <Icon size={size} />
    </span>
  );
}
