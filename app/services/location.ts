import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

export type GetPositionOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  forceRequestLocation?: boolean;
  showLocationDialog?: boolean;
};

const defaultOptions: Required<GetPositionOptions> = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000,
  forceRequestLocation: true,
  showLocationDialog: true,
};

export async function getCurrentPosition(
  options: GetPositionOptions = {},
): Promise<GeoPosition> {
  const merged: Required<GetPositionOptions> = {
    ...defaultOptions,
    ...options,
  };

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => resolve(position),
      error => reject(error),
      merged,
    );
  });
}
