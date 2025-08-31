import { useCallback, useMemo, useState } from 'react';
import type { Region } from 'react-native-maps';
import { getCurrentPosition } from '@services/location';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 } as const;
const DEFAULT_CITY: Coordinates = { latitude: 37.7749, longitude: -122.4194 };
const DEFAULT_CITY_DELTA = {
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
} as const;

export function useCurrentLocation() {
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [region, setRegion] = useState<Region | null>({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
    ...DEFAULT_CITY_DELTA,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const requestPosition = useCallback(async () => {
    setIsLocating(true);
    console.log('[Location] requestPosition: starting');
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const nextRegion: Region = { latitude, longitude, ...DEFAULT_DELTA };
      setCurrentCoords({ latitude, longitude });
      setRegion(nextRegion);
      setIsLocating(false);
      console.log(
        '[Location] requestPosition: success',
        JSON.stringify({ latitude, longitude }),
      );
      return nextRegion;
    } catch (error: any) {
      const code = (error as any)?.code;
      if (code === 1) {
        setPermissionDenied(true);
        console.log('[Location] permission denied by user/system');
      } else {
        console.log('[Location] requestPosition: error', code, error);
      }
      const fallbackRegion: Region = {
        latitude: DEFAULT_CITY.latitude,
        longitude: DEFAULT_CITY.longitude,
        ...DEFAULT_CITY_DELTA,
      };
      setCurrentCoords({
        latitude: DEFAULT_CITY.latitude,
        longitude: DEFAULT_CITY.longitude,
      });
      setRegion(prev => prev ?? fallbackRegion);
      setIsLocating(false);
      console.log('[Location] using fallback region (San Francisco)');
      return null;
    }
  }, []);

  const defaults = useMemo(
    () => ({
      DEFAULT_DELTA,
      DEFAULT_CITY,
      DEFAULT_CITY_DELTA,
    }),
    [],
  );

  return {
    currentCoords,
    region,
    setRegion,
    isLocating,
    permissionDenied,
    requestPosition,
    defaults,
  } as const;
}
