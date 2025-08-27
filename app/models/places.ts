export type NearbyPlace = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
  rating?: number;
  price_level?: number;
  address?: string;
  image_url?: string;
  distance?: number;
  distanceMeters?: number;
  [key: string]: unknown;
};

export type NearbyParams = {
  lat: number;
  lng: number;
  radiusKm?: number; // default 5
  limit?: number; // default 20
  type?:
    | 'restaurant'
    | 'cafe'
    | 'gas_station'
    | 'bank'
    | 'pharmacy'
    | 'lodging'
    | 'park'
    | 'gym'
    | 'hospital'
    | 'shopping_mall'
    | 'all'
    | string;
};

export type PlaceDetails = {
  id: string;
  name: string;
  type?: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  rating?: number;
  price_level?: number;
  hours?: Record<string, string>;
  image_url?: string;
  description?: string;
  [key: string]: unknown;
};
