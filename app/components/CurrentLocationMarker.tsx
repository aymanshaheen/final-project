import React from 'react';
import { Marker } from 'react-native-maps';
import { UserMarker } from '@components/UserMarker';
import { useMapPulse } from '@hooks/useMapPulse';

type Coords = { latitude: number; longitude: number } | null | undefined;

export function CurrentLocationMarker({ coords }: { coords: Coords }) {
  const { fadePulse, scalePulse } = useMapPulse();

  if (!coords) return null;
  return (
    <Marker coordinate={coords}>
      <UserMarker pulseOpacity={fadePulse} pulseScale={scalePulse} />
    </Marker>
  );
}
