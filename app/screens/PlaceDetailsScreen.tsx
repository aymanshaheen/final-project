import React from 'react';
import { ScrollView, StyleSheet, View, Text, Animated } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing } from '@styles';
import { usePlaceDetails } from '@hooks/usePlaceDetails';
import { LoadingState, ErrorState } from '@components/ScreenStates';
import { PlaceCover } from '@components/PlaceCover';
import { PlaceHeader } from '@components/PlaceHeader';
import { PlaceContact } from '@components/PlaceContact';
import { PlaceHours } from '@components/PlaceHours';

type DetailsRoute = RouteProp<RootStackParamList, 'PlaceDetails'>;

export default function PlaceDetailsScreen(): React.ReactElement {
  const route = useRoute<DetailsRoute>();
  const placeId = String(route.params.id);
  const mountProgress = React.useRef(new Animated.Value(0)).current;
  const {
    isLoading,
    error,
    details,
    hoursList,
    distanceLabel,
    openDirections,
    retry,
  } = usePlaceDetails(placeId);

  React.useEffect(() => {
    Animated.timing(mountProgress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [mountProgress]);

  if (isLoading) {
    return <LoadingState text="Loading place…" />;
  }

  if (error || !details) {
    return <ErrorState message={error ?? 'No details found'} onRetry={retry} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View
        style={{
          opacity: mountProgress,
          transform: [
            {
              translateY: mountProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        }}
      >
        <PlaceCover imageUrl={details.image_url ?? undefined} />

        <PlaceHeader
          name={details.name}
          type={details.type ?? undefined}
          rating={details.rating ?? null}
          priceLevel={details.price_level ?? null}
          distanceLabel={distanceLabel}
          address={details.address ?? null}
          onDirections={openDirections}
        />

        {!!details.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.paragraph}>{details.description}</Text>
          </View>
        )}

        <PlaceContact
          phone={details.phone ?? null}
          website={details.website ?? null}
        />

        <PlaceHours items={hoursList} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundPrimary },
  content: { paddingBottom: spacing.xxl },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.white,
    fontWeight: '700',
  },
  paragraph: {
    color: colors.white,
    lineHeight: 20,
  },
});
