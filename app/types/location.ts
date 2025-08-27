export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type PermissionState =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';
