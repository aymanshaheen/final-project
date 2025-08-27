import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { FlatList } from 'react-native';
import MapView, {
  MapViewProps,
  Region,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing } from '@styles';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { clamp } from '@utils/clamp';
import { ZoomControls } from '@components/ZoomControls';
import { LocateButton } from '@components/LocateButton';
import { useNearbyPlaces } from '@hooks/useNearbyPlaces';
import { PlacesMarkers } from '@components/PlacesMarkers';
import { PlacesList } from '@components/PlacesList';
import { FilterBar } from '@components/FilterBar';
import { EmptyState, ErrorState } from '@components/ScreenStates';
import { CurrentLocationMarker } from '@components/CurrentLocationMarker';
import { useDebounced } from '@hooks/useDebounced';
import { useMapZoom } from '@hooks/useMapZoom';
import { getPinColorForType } from '@utils/placePins';
import type { NearbyPlace } from '@models/places';

export default function MapScreen(): React.ReactElement {
  const mapRef = useRef<MapView | null>(null);
  const listRef = useRef<FlatList<NearbyPlace> | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    currentCoords,
    region,
    setRegion,
    isLocating,
    permissionDenied,
    requestPosition,
  } = useCurrentLocation();

  const [selectedPlaceId, setSelectedPlaceId] = useState<
    string | number | null
  >(null);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [type, setType] = useState<string>('all');
  const debouncedRadiusKm = useDebounced(radiusKm, 250);
  const debouncedType = useDebounced(type, 250);

  useEffect(() => {
    console.log('[Map] requesting position on mount');
    requestPosition();
  }, [requestPosition]);

  const {
    isLoading: hookLoading,
    error: hookError,
    places: hookPlaces,
    sortedByDistance,
    reload,
  } = useNearbyPlaces(region ?? null, {
    radiusKm: debouncedRadiusKm,
    type: debouncedType === 'all' ? undefined : debouncedType,
    limit: 30,
  });

  const { onZoom } = useMapZoom(mapRef, region ?? null, setRegion);

  const onRecenter = useCallback(async () => {
    const next = await requestPosition();
    if (next) {
      mapRef.current?.animateToRegion(next, 350);
    } else if (region) {
      mapRef.current?.animateToRegion(region, 350);
    }
  }, [requestPosition, region]);


  const provider: MapViewProps['provider'] | undefined =
    Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

  const focusPlace = useCallback(
    (
      place: NearbyPlace,
      options?: { zoomFactor?: number; durationMs?: number },
    ) => {
      const zoomFactor = options?.zoomFactor ?? 0.8;
      const durationMs = options?.durationMs ?? 350;
      const baseLatDelta = region?.latitudeDelta ?? 0.01;
      const baseLngDelta = region?.longitudeDelta ?? 0.01;
      const next: Region = {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: clamp(baseLatDelta * zoomFactor, 0.0005, 60),
        longitudeDelta: clamp(baseLngDelta * zoomFactor, 0.0005, 60),
      };
      setRegion(next);
      mapRef.current?.animateToRegion(next, durationMs);
    },
    [region, setRegion],
  );

  const scrollListToPlace = useCallback(
    (placeId: string | number) => {
      const index = sortedByDistance.findIndex(p => p.id === placeId);
      if (index < 0) return;
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    },
    [sortedByDistance],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={ref => {
          mapRef.current = ref;
        }}
        style={StyleSheet.absoluteFill}
        provider={provider}
        showsUserLocation={false}
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        initialRegion={region ?? undefined}
        onRegionChangeComplete={setRegion}
      >
        <CurrentLocationMarker coords={currentCoords} />

        <PlacesMarkers
          places={(hookPlaces as NearbyPlace[]) ?? []}
          selectedId={selectedPlaceId}
          getPinColorForType={getPinColorForType}
          onPressPlace={useCallback(
            place => {
              setSelectedPlaceId(place.id);
              focusPlace(place as NearbyPlace, {
                zoomFactor: 0.8,
                durationMs: 350,
              });
              scrollListToPlace(place.id);
              navigation.navigate('PlaceDetails', { id: String(place.id) });
            },
            [focusPlace, navigation, scrollListToPlace],
          )}
          calloutContainerStyle={styles.callout}
          calloutTitleStyle={styles.calloutTitle}
        />
      </MapView>

      <View style={styles.topControls} pointerEvents="box-none">
        <ZoomControls
          onZoomIn={() => onZoom('in')}
          onZoomOut={() => onZoom('out')}
        />
      </View>

      <FilterBar
        selectedRadiusKm={radiusKm}
        onChangeRadiusKm={km => setRadiusKm(km)}
        selectedType={type}
        onChangeType={next => setType(next)}
      />

      <View style={styles.controls} pointerEvents="box-none">
        <LocateButton isLocating={isLocating} onPress={onRecenter} />
        {permissionDenied ? (
          <LocateButton
            isLocating={false}
            onPress={() => navigation.navigate('Permission')}
            title="Enable Location"
            icon="⚙️"
          />
        ) : null}
      </View>

      {hookLoading || sortedByDistance.length > 0 ? (
        <PlacesList
          items={sortedByDistance}
          selectedId={selectedPlaceId}
          onPressItem={item => {
            setSelectedPlaceId(item.id);
            focusPlace(item as NearbyPlace, {
              zoomFactor: 0.8,
              durationMs: 350,
            });
            navigation.navigate('PlaceDetails', { id: String(item.id) });
          }}
          onProvideListRef={ref => {
            // @ts-ignore
            listRef.current = ref;
          }}
          isLoading={hookLoading}
        />
      ) : null}

      {!hookLoading && hookError ? (
        <View style={styles.loadingOverlay}>
          <ErrorState message={hookError} onRetry={reload} />
        </View>
      ) : null}

      {!hookLoading && !hookError && sortedByDistance.length === 0 ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <EmptyState
            title="No places found"
            subtitle="Try another type or radius."
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  controls: {
    position: 'absolute',
    left: spacing.lg,
    top: spacing.xxxl + spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    zIndex: 999,
    elevation: 6,
  },
  topControls: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xxxl + spacing.lg,
    alignItems: 'center',
    zIndex: 999,
    elevation: 6,
  },
  permissionBanner: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxxl * 3 + spacing.sm,
    zIndex: 1000,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callout: {
    maxWidth: 220,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  calloutTitle: {
    color: colors.textPrimary,
    fontSize: 14,
  },
});
