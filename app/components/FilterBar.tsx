import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import { colors, spacing, typography } from '@styles';

type Props = {
  selectedRadiusKm: number;
  onChangeRadiusKm: (km: number) => void;
  selectedType: string;
  onChangeType: (type: string) => void;
};

const RADIUS_OPTIONS: number[] = [1, 5, 10];

const TYPE_OPTIONS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'cafe', label: 'Cafes' },
  { key: 'park', label: 'Parks' },
  { key: 'gas_station', label: 'Gas' },
  { key: 'pharmacy', label: 'Pharmacies' },
  { key: 'bank', label: 'Banks' },
  { key: 'lodging', label: 'Lodging' },
  { key: 'gym', label: 'Gyms' },
  { key: 'hospital', label: 'Hospitals' },
  { key: 'shopping_mall', label: 'Malls' },
];

export function FilterBar({
  selectedRadiusKm,
  onChangeRadiusKm,
  selectedType,
  onChangeType,
}: Props): React.ReactElement {
  const [expanded, setExpanded] = useState<boolean>(false);
  const gearRotation = useRef(new Animated.Value(0)).current;
  const cardProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(gearRotation, {
      toValue: expanded ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(cardProgress, {
      toValue: expanded ? 1 : 0,
      duration: expanded ? 260 : 200,
      easing: expanded ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [expanded, gearRotation, cardProgress]);

  const gearStyle = useMemo(() => {
    const rotate = gearRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    return { transform: [{ rotate }] } as const;
  }, [gearRotation]);

  const cardStyle = useMemo(() => {
    const translateY = cardProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-6, 0],
    });
    const opacity = cardProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return { opacity, transform: [{ translateY }] } as const;
  }, [cardProgress]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => setExpanded(prev => !prev)}
          accessibilityRole="button"
          style={styles.gearButton}
          activeOpacity={0.8}
        >
          <Animated.Text style={[styles.gearButtonText, gearStyle]}>
            ⚙️
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {expanded ? (
        <Animated.View style={[styles.filterCard, cardStyle]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            style={styles.scroll}
          >
            <Text style={styles.sectionLabel}>Radius:</Text>
            {RADIUS_OPTIONS.map(km => {
              const selected = km === selectedRadiusKm;
              return (
                <TouchableOpacity
                  key={`r-${km}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onChangeRadiusKm(km)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {km} km
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Type:</Text>
            {TYPE_OPTIONS.map(opt => {
              const selected = opt.key === selectedType;
              return (
                <TouchableOpacity
                  key={`t-${opt.key}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onChangeType(opt.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.xl,
    top: spacing.xxxl * 2 + spacing.xxxl * 2.2,
    zIndex: 1000,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  gearButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  gearButtonText: {
    fontSize: 22,
  },
  scroll: {
    flexGrow: 0,
  },
  filterCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: spacing.xs,
  },
  row: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginRight: spacing.xs,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.accentPrimaryAlpha15,
    borderColor: colors.accentPrimary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  chipTextSelected: {
    color: colors.accentPrimary,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xs,
  },
});
