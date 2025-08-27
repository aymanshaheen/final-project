import { useCallback } from 'react';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { clamp } from '@utils/clamp';

export function useMapZoom(
  mapRef: React.MutableRefObject<MapView | null>,
  region: Region | null | undefined,
  setRegion: (r: Region) => void,
) {
  const onZoom = useCallback(
    (direction: 'in' | 'out') => {
      if (!region) return;
      const factor = direction === 'in' ? 0.5 : 2;
      const next: Region = {
        ...region,
        latitudeDelta: clamp(region.latitudeDelta * factor, 0.0005, 60),
        longitudeDelta: clamp(region.longitudeDelta * factor, 0.0005, 60),
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, 250);
    },
    [mapRef, region, setRegion],
  );

  return { onZoom } as const;
}
