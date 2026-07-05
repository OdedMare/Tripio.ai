import type {
  Attraction,
  Hotel,
  Restaurant,
  TravelProfile,
  Trip,
  User,
} from "@/types/trip.types";

export const mockUser: User = {
  id: "user-1",
  name: "Maya",
  email: "maya@tripio.ai",
  avatar: "M",
  location: "San Francisco",
  travelStyle: "Design-led, calm luxury",
  preferences: ["Boutique stays", "Coffee-first mornings", "Slow pacing"],
};

export const mockProfile: TravelProfile = {
  id: "profile-1",
  pace: "balanced",
  interests: ["Art", "Food", "Wellness", "Photography"],
  preferredBudget: "midRange",
  accommodationStyle: "Boutique hotels near walkable neighborhoods",
};

export const mockHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Aster House",
    location: "Canggu",
    rating: 4.9,
    priceRange: "$$$",
    amenities: ["Ocean view", "Spa", "Breakfast"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "A serene hideaway with sculptural interiors and a rooftop pool.",
  },
  {
    id: "hotel-2",
    name: "The Harbor Loft",
    location: "Santorini",
    rating: 4.8,
    priceRange: "$$$$",
    amenities: ["Infinity pool", "Sunset terrace", "Airport transfer"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    description: "An airy contemporary retreat balancing privacy and views.",
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "restaurant-1",
    name: "Sea & Stone",
    location: "Canggu",
    cuisine: "Modern Indonesian",
    rating: 4.8,
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    description: "Open-air dinner service with chef tasting menus.",
  },
  {
    id: "restaurant-2",
    name: "Sunset Table",
    location: "Santorini",
    cuisine: "Mediterranean",
    rating: 4.7,
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    description: "A romantic cliffside experience with local wine pairings.",
  },
];

export const mockAttractions: Attraction[] = [
  {
    id: "attraction-1",
    name: "Tegalalang Rice Terraces",
    location: "Ubud",
    category: "Scenic",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    description: "A dramatic landscape of emerald paddies and quiet villages.",
  },
  {
    id: "attraction-2",
    name: "Oia Catwalk",
    location: "Santorini",
    category: "Sunset walk",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    description: "Golden-hour views with a cinematic Mediterranean backdrop.",
  },
];

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    title: "Island Reset in Bali",
    description: "A slow, design-led escape with surf mornings and sunset dinners.",
    location: "Bali, Indonesia",
    duration: "7 days",
    dates: "Sep 12 – Sep 19",
    summary: "Balance beach time, spa rituals, and thoughtful cultural detours.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
    highlights: ["Boutique stay", "Private driver", "Sunset sailing"],
    createdAt: "2026-06-10",
    days: [
      {
        dayNumber: 1,
        title: "Arrival & beach reset",
        focus: "Check-in and decompress",
        notes: "Take the evening for a low-key dinner and a swim at the beach club.",
      },
      {
        dayNumber: 2,
        title: "Surf & coffee circuit",
        focus: "Morning movement",
        notes: "Start with breakfast by the sea and a short surf lesson at noon.",
      },
    ],
    hotels: [mockHotels[0]],
    restaurants: [mockRestaurants[0]],
    attractions: [mockAttractions[0]],
    profile: mockProfile,
  },
  {
    id: "trip-2",
    title: "Aegean Summer Escape",
    description: "A polished itinerary focused on light luxury and golden-hour views.",
    location: "Santorini, Greece",
    duration: "5 days",
    dates: "Aug 02 – Aug 07",
    summary: "Classic architecture, fine dining, and memorable sunset moments.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
    highlights: ["Cliffside suite", "Catamaran sunset", "Wine tasting"],
    createdAt: "2026-05-21",
    days: [
      {
        dayNumber: 1,
        title: "Arrival to Oia",
        focus: "Rest and settle in",
        notes: "Book an evening terrace dinner after a slow check-in.",
      },
      {
        dayNumber: 2,
        title: "Caldera views",
        focus: "Scenic exploration",
        notes: "Walk the cliffside path and pause for a long lunch in the afternoon.",
      },
    ],
    hotels: [mockHotels[1]],
    restaurants: [mockRestaurants[1]],
    attractions: [mockAttractions[1]],
    profile: mockProfile,
  },
];
