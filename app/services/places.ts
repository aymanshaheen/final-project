import { Alert } from 'react-native';
import type { NearbyPlace, NearbyParams, PlaceDetails } from '@models/places';
export type { NearbyPlace, NearbyParams, PlaceDetails } from '@models/places';

const API_BASE = 'https://nbp-production.up.railway.app';

export async function fetchNearbyPlaces({
  lat,
  lng,
  radiusKm = 5,
  limit = 20,
  type,
}: NearbyParams): Promise<NearbyPlace[]> {
  const clampedLat = Math.max(-90, Math.min(90, lat));
  const clampedLng = Math.max(-180, Math.min(180, lng));

  const queryParts: string[] = [
    `lat=${encodeURIComponent(String(clampedLat))}`,
    `lng=${encodeURIComponent(String(clampedLng))}`,
    `radius=${encodeURIComponent(String(radiusKm))}`,
    `limit=${encodeURIComponent(String(limit))}`,
  ];
  if (type && type !== 'all') {
    queryParts.push(`type=${encodeURIComponent(String(type))}`);
  }

  const url = `${API_BASE}/api/places/nearby?${queryParts.join('&')}`;

  try {
    console.log('[Places] fetching', {
      lat: clampedLat,
      lng: clampedLng,
      radiusKm,
      limit,
      type,
      url,
    });
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[Places] response not ok', res.status, res.statusText);
      throw new Error(`Request failed: ${res.status}`);
    }
    const json = await res.json();
    const rawList: any[] = Array.isArray(json?.places)
      ? json.places
      : Array.isArray(json)
      ? json
      : [];

    const normalized: NearbyPlace[] = rawList
      .map(item => {
        const candidateLat =
          typeof item?.latitude === 'number' ? item.latitude : item?.lat;
        const candidateLng =
          typeof item?.longitude === 'number' ? item.longitude : item?.lng;

        if (
          typeof candidateLat !== 'number' ||
          typeof candidateLng !== 'number'
        ) {
          return null;
        }

        const result: NearbyPlace = {
          id: item?.id,
          name: item?.name,
          latitude: candidateLat,
          longitude: candidateLng,
        };

        if (item?.type) result.type = item.type;
        if (item?.address) result.address = item.address;
        if (typeof item?.rating === 'number') result.rating = item.rating;
        if (typeof item?.price_level === 'number')
          result.price_level = item.price_level;
        if (typeof item?.image_url === 'string')
          result.image_url = item.image_url;
        if (typeof item?.distance === 'number') result.distance = item.distance; // as provided by API

        return result;
      })
      .filter(Boolean) as NearbyPlace[];

    console.log('[Places] received', { count: normalized.length });
    return normalized;
  } catch (error) {
    Alert.alert('Error', 'Try again');
    console.warn('[Places] fetch error', error);
    throw error;
  }
}

export async function fetchPlaceById(
  id: string | number,
): Promise<PlaceDetails> {
  const placeId = String(id);
  const url = `${API_BASE}/api/places/${encodeURIComponent(placeId)}`;
  try {
    console.log('[Places] fetching details', { id: placeId, url });
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(
        '[Places] details response not ok',
        res.status,
        res.statusText,
      );
      throw new Error(`Request failed: ${res.status}`);
    }
    const json = (await res.json()) as any;
    const details: PlaceDetails = {
      id: json?.id ?? placeId,
      name: json?.name ?? 'Unknown',
      type: json?.type,
      address: json?.address,
      lat: json?.lat ?? json?.latitude,
      lng: json?.lng ?? json?.longitude,
      phone: json?.phone,
      website: json?.website,
      rating: typeof json?.rating === 'number' ? json.rating : undefined,
      price_level:
        typeof json?.price_level === 'number' ? json.price_level : undefined,
      hours: json?.hours,
      image_url: json?.image_url,
      description: json?.description,
      ...json,
    };
    return details;
  } catch (error) {
    Alert.alert('Error', 'Failed to load place details. Try again');
    console.warn('[Places] details fetch error', error);
    throw error;
  }
}
