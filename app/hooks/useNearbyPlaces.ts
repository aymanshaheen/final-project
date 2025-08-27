import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { fetchNearbyPlaces } from '@services/places';
import { haversineMeters } from '@utils/distance';
import type { NearbyPlace } from '@models/places';

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function useNearbyPlaces(
  region: Region | null,
  options?: { radiusKm?: number; type?: string; limit?: number },
) {
  const { currentCoords } = useCurrentLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<{
    lat: number;
    lng: number;
    radiusKm?: number;
    type?: string;
  } | null>(null);

  const load = useCallback(async () => {
    const center = region
      ? { latitude: region.latitude, longitude: region.longitude }
      : currentCoords
      ? { latitude: currentCoords.latitude, longitude: currentCoords.longitude }
      : null;
    if (!center) return;

    const prev = lastFetchRef.current;
    const EPSILON_DEGREES = 0.0001; // ~11m
    if (
      prev &&
      Math.abs(prev.lat - center.latitude) < EPSILON_DEGREES &&
      Math.abs(prev.lng - center.longitude) < EPSILON_DEGREES &&
      prev.radiusKm === (options?.radiusKm ?? 20) &&
      prev.type === options?.type &&
      places.length > 0
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNearbyPlaces({
        lat: center.latitude,
        lng: center.longitude,
        radiusKm: options?.radiusKm ?? 20,
        limit: options?.limit ?? 20,
        type: options?.type,
      });
      const normalized: NearbyPlace[] = (data ?? []).map((item: any) => {
        const candidateType: string | undefined =
          item?.type ||
          item?.category ||
          (Array.isArray(item?.types) ? item.types[0] : undefined) ||
          item?.primary_type ||
          undefined;
        const candidateRating: number | undefined =
          toNumber(item?.rating) ??
          toNumber(item?.user_rating) ??
          (typeof item?.rating?.value === 'number'
            ? item.rating.value
            : undefined);
        return {
          id: item.id,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          type: candidateType,
          rating: candidateRating,
        } as NearbyPlace;
      });
      setPlaces(normalized);
      lastFetchRef.current = {
        lat: center.latitude,
        lng: center.longitude,
        radiusKm: options?.radiusKm ?? 20,
        type: options?.type,
      };
    } catch (e) {
      // Fail softly: clear list but don't block UI
      setPlaces([]);
      setError(
        e instanceof Error ? e.message : 'Failed to load places. Please retry.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    region,
    currentCoords?.latitude,
    currentCoords?.longitude,
    places.length,
    options?.radiusKm,
    options?.type,
    options?.limit,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedByDistance = useMemo<NearbyPlace[]>(() => {
    if (!places || places.length === 0) return [];
    const origin = region
      ? { lat: region.latitude, lng: region.longitude }
      : currentCoords
      ? { lat: currentCoords.latitude, lng: currentCoords.longitude }
      : null;
    if (!origin) return [...places];
    const withDistance = places.map(p => ({
      ...p,
      distanceMeters: haversineMeters(
        origin.lat,
        origin.lng,
        p.latitude,
        p.longitude,
      ),
    }));
    withDistance.sort((a, b) => {
      const da = a.distanceMeters ?? Number.POSITIVE_INFINITY;
      const db = b.distanceMeters ?? Number.POSITIVE_INFINITY;
      return da - db;
    });
    return withDistance;
  }, [
    places,
    region?.latitude,
    region?.longitude,
    currentCoords?.latitude,
    currentCoords?.longitude,
  ]);

  return { isLoading, error, places, sortedByDistance, reload: load } as const;
}
