import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@styles';
import { Button } from '@components/Button';

type Props = {
  name: string;
  type?: string;
  rating?: number | null;
  priceLevel?: number | null;
  distanceLabel?: string | null;
  address?: string | null;
  onDirections: () => void;
};

export function PlaceHeader({
  name,
  type,
  rating,
  priceLevel,
  distanceLabel,
  address,
  onDirections,
}: Props): React.ReactElement {
  return (
    <View style={styles.headerBlock}>
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>
      <View style={styles.metaRow}>
        {!!type && <Text style={styles.metaText}>{type}</Text>}
        {!!rating && (
          <Text style={styles.metaText}>{`  ★ ${rating.toFixed(1)}`}</Text>
        )}
        {!!priceLevel && (
          <Text style={styles.metaText}>{`  ·  ${'$'.repeat(
            Math.min(4, Math.max(1, priceLevel)),
          )}`}</Text>
        )}
        {distanceLabel ? (
          <Text style={styles.metaText}>{`  ·  ${distanceLabel}`}</Text>
        ) : null}
      </View>
      {!!address && (
        <Text style={styles.address} numberOfLines={3}>
          {address}
        </Text>
      )}
      <Button
        title="🧭 Get Directions"
        onPress={onDirections}
        style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    color: colors.white,
    fontSize: typography.sizes.h4,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.white,
  },
  address: {
    color: colors.white,
  },
});
