
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import { colors, spacing } from '@styles';
import { formatDistance } from '@utils/distance';
import { ListSkeleton } from '@components/ScreenStates';

export type PlacesListItem = {
  id: string | number;
  name: string;
  type?: string;
  rating?: number;
  distanceMeters?: number;
};

type Props = {
  items: PlacesListItem[];
  selectedId: string | number | null;
  onPressItem: (item: PlacesListItem) => void;
  onProvideListRef?: (ref: FlatList<PlacesListItem> | null) => void;
  isLoading?: boolean;
};

export function PlacesList({
  items,
  selectedId,
  onPressItem,
  onProvideListRef,
  isLoading,
}: Props): React.ReactElement | null {
  const keyExtractor = useCallback(
    (item: PlacesListItem) => String(item.id),
    [],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: PlacesListItem; index: number }) => (
      <AnimatedPlaceCard
        item={item}
        index={index}
        isSelected={selectedId === item.id}
        onPress={() => onPressItem(item)}
      />
    ),
    [onPressItem, selectedId],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.bottomListContainer} pointerEvents="box-none">
        <View style={styles.list}>
          <ListSkeleton count={5} />
        </View>
      </View>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.bottomListContainer} pointerEvents="box-none">
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        ref={ref => onProvideListRef?.(ref)}
        renderItem={renderItem}
        extraData={selectedId}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={5}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={() => {
          onProvideListRef?.(null);
        }}
      />
    </View>
  );
}

type AnimatedCardProps = {
  item: PlacesListItem;
  index: number;
  isSelected: boolean;
  onPress: () => void;
};

const AnimatedPlaceCard = memo(function AnimatedPlaceCard({
  item,
  index,
  isSelected,
  onPress,
}: AnimatedCardProps): React.ReactElement {
  const mountProgress = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const selectedScale = useRef(
    new Animated.Value(isSelected ? 1.02 : 1),
  ).current;

  useEffect(() => {
    mountProgress.setValue(0);
    Animated.timing(mountProgress, {
      toValue: 1,
      duration: 350,
      delay: Math.min(index, 10) * 40,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(selectedScale, {
      toValue: isSelected ? 1.02 : 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isSelected, selectedScale]);

  const animatedStyle = useMemo(() => {
    const translateY = mountProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [8, 0],
    });
    const opacity = mountProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const scale = Animated.multiply(pressScale, selectedScale);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    } as const;
  }, [mountProgress, pressScale, selectedScale]);

  return (
    <Animated.View style={[styles.animatedCardWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={() => {
          Animated.timing(pressScale, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(pressScale, {
            toValue: 1,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start();
        }}
        onPress={onPress}
        style={[styles.placeCard, isSelected && styles.placeCardSelected]}
      >
        <View style={styles.placeTitleRow}>
          <Text
            style={[styles.placeTitle, isSelected && styles.placeTitleSelected]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <View style={styles.placeMetaRow}>
          <Text
            style={[
              styles.placeMetaText,
              isSelected && styles.placeMetaTextSelected,
            ]}
            numberOfLines={1}
          >
            {[
              item.type,
              item.rating != null ? `★ ${item.rating.toFixed(1)}` : undefined,
              item.distanceMeters != null
                ? formatDistance(item.distanceMeters)
                : undefined,
            ]
              .filter(Boolean)
              .join('  •  ')}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  bottomListContainer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    zIndex: 1001,
    elevation: 8,
  },
  list: {
    maxHeight: 260,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  animatedCardWrapper: {
    // wrapper to host transforms/opacity without affecting card layout
  },
  placeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  placeCardSelected: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.accentPrimaryAlpha15,
  },
  placeTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  placeTitleSelected: {
    color: colors.accentPrimary,
  },
  placeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  placeDistance: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  placeDistanceSelected: {
    color: colors.black,
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  placeMetaText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  placeMetaTextSelected: {
    color: colors.black,
  },
});
