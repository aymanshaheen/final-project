const Geolocation = {
  getCurrentPosition: (
    success: (pos: any) => void,
    _error?: (err: any) => void,
  ) => {
    success({ coords: { latitude: 37.7749, longitude: -122.4194 } });
  },
};

export type GeoPosition = {
  coords: { latitude: number; longitude: number };
};

export default Geolocation;
