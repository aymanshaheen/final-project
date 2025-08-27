import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { colors } from '@styles';

export type PlaceMarkerItem = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
};

type Props = {
  places: PlaceMarkerItem[];
  selectedId: string | number | null;
  getPinColorForType: (type?: string) => string;
  onPressPlace: (place: PlaceMarkerItem) => void;
  calloutTitleStyle: any;
  calloutContainerStyle: any;
};

export const PlacesMarkers = React.memo(function PlacesMarkers({
  places,
  selectedId,
  getPinColorForType,
  onPressPlace,
  calloutTitleStyle,
  calloutContainerStyle,
}: Props): React.ReactElement {
  return (
    <View>
      {places.map(place => (
        <Marker
          key={String(place.id)}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          pinColor={
            selectedId === place.id
              ? colors.accentPrimary
              : getPinColorForType(place.type)
          }
          tracksViewChanges={false}
          onPress={() => onPressPlace(place)}
        >
          <Callout tooltip={false}>
            <View style={calloutContainerStyle}>
              <Text style={calloutTitleStyle} numberOfLines={1}>
                {place.name}
              </Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </View>
  );
});
