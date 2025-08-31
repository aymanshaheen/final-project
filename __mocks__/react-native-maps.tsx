import React from 'react';

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const MapView: React.FC<any> = ({ children }) => <>{children}</>;

export const PROVIDER_GOOGLE = 'google';

export default MapView;
