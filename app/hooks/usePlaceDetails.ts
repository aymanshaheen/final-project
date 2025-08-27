import { useEffect, useMemo, useState, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { fetchPlaceById } from '@services/places';
import type { PlaceDetails } from '@models/places';
import { formatDistance, haversineMeters } from '@utils/distance';

export function usePlaceDetails(placeId: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const { currentCoords } = useCurrentLocation();

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPlaceById(placeId);
      setDetails(data);
    } catch (e) {
      setError('Failed to load place details');
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPlaceById(placeId);
        if (!isActive) return;
        setDetails(data);
      } catch (e) {
        if (!isActive) return;
        setError('Failed to load place details');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    run();
    return () => {
      isActive = false;
    };
  }, [placeId]);

  const hoursList = useMemo(() => {
    if (!details?.hours) return [] as Array<{ day: string; value: string }>;
    return Object.entries(details.hours).map(([day, value]) => ({
      day,
      value: String(value),
    }));
  }, [details?.hours]);

  const distanceMeters = useMemo(() => {
    if (!details?.lat || !details?.lng) return null;
    if (!currentCoords) return null;
    return haversineMeters(
      currentCoords.latitude,
      currentCoords.longitude,
      details.lat,
      details.lng,
    );
  }, [currentCoords, details?.lat, details?.lng]);

  const distanceLabel = useMemo(() => {
    if (distanceMeters == null) return null;
    return formatDistance(distanceMeters);
  }, [distanceMeters]);

  const openDirections = useCallback(async () => {
    if (!details?.lat || !details?.lng) return;
    const { lat, lng, name } = details;
    const iosUrl = `maps://?daddr=${lat},${lng}`;
    const androidUrl = `geo:0,0?q=${lat},${lng}${
      name ? `(${encodeURIComponent(name)})` : ''
    }`;
    const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const url = Platform.OS === 'ios' ? iosUrl : androidUrl;
    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : webFallback);
    } catch {
      Linking.openURL(webFallback);
    }
  }, [details?.lat, details?.lng, details?.name]);

  return {
    isLoading,
    error,
    details,
    hoursList,
    distanceLabel,
    openDirections,
    retry: load,
  } as const;
}
