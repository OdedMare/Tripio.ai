export interface PlaceSuggestion {
  placeId: string;
  text: string;
}

export interface PlaceDetail {
  name: string;
  location: string;
  rating: number;
  priceLevel: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
  googleMapsUri: string | null;
  websiteUri: string | null;
  types: string[];
}
