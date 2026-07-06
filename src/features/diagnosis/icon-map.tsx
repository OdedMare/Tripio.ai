import {
  Backpack,
  Bus,
  BedDouble,
  Building2,
  CalendarX,
  CameraOff,
  Car,
  CarFront,
  Coffee,
  Compass,
  Crown,
  Dice5,
  Footprints,
  Gem,
  Home,
  House,
  Key,
  Landmark,
  ListChecks,
  MapPin,
  MountainSnow,
  Palmtree,
  Scale,
  Shuffle,
  Sparkles,
  Sun,
  Train,
  Trees,
  Users,
  Utensils,
  Zap,
} from "lucide-react";

interface DiagnosisIconProps {
  icon: string;
  size?: number;
}

export function DiagnosisIcon({ icon, size = 18 }: DiagnosisIconProps) {
  switch (icon) {
    case "compass":
      return <Compass size={size} />;
    case "sun":
      return <Sun size={size} />;
    case "landmark":
      return <Landmark size={size} />;
    case "utensils":
      return <Utensils size={size} />;
    case "mountain-snow":
      return <MountainSnow size={size} />;
    case "users":
      return <Users size={size} />;
    case "coffee":
      return <Coffee size={size} />;
    case "scale":
      return <Scale size={size} />;
    case "zap":
      return <Zap size={size} />;
    case "calendar-x":
      return <CalendarX size={size} />;
    case "camera-off":
      return <CameraOff size={size} />;
    case "bus":
      return <Bus size={size} />;
    case "bed-double":
      return <BedDouble size={size} />;
    case "trees":
      return <Trees size={size} />;
    case "building-2":
      return <Building2 size={size} />;
    case "map-pin":
      return <MapPin size={size} />;
    case "backpack":
      return <Backpack size={size} />;
    case "home":
      return <Home size={size} />;
    case "gem":
      return <Gem size={size} />;
    case "crown":
      return <Crown size={size} />;
    case "list-checks":
      return <ListChecks size={size} />;
    case "shuffle":
      return <Shuffle size={size} />;
    case "dice-5":
      return <Dice5 size={size} />;
    case "sparkles":
      return <Sparkles size={size} />;
    case "palmtree":
      return <Palmtree size={size} />;
    case "house":
      return <House size={size} />;
    case "key":
      return <Key size={size} />;
    case "footprints":
      return <Footprints size={size} />;
    case "car":
      return <Car size={size} />;
    case "car-front":
      return <CarFront size={size} />;
    case "train":
      return <Train size={size} />;
    default:
      return <Sparkles size={size} />;
  }
}
