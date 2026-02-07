export interface HeritageSite {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  rating?: number;
  photoReference?: string;
  isVisited?: boolean;
  distance?: number; // Distance from user in meters
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface PlacesSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // in meters, default 2000
}

export interface ReportLocation {
  latitude: number;
  longitude: number;
  address?: string; // Optional human-readable address
}
