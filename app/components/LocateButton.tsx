import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@styles';

type Props = {
  isLocating: boolean;
  onPress: () => void;
  style?: ViewStyle;
  title?: string;
  icon?: string;
};

export function LocateButton({
  isLocating,
  onPress,
  style,
  title = 'Locate Me',
  icon = '📍',
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ busy: isLocating, disabled: isLocating }}
      onPress={onPress}
      disabled={isLocating}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [
        styles.locateButton,
        pressed && styles.locatePressed,
        isLocating && styles.locateDisabled,
        style,
      ]}
    >
      {isLocating ? (
        <>
          <ActivityIndicator
            color={colors.textOnPrimary}
            style={styles.loader}
          />
          <Text style={styles.locateText}>Locating...</Text>
        </>
      ) : (
        <>
          <Text style={styles.locateIcon}>{icon}</Text>
          <Text style={styles.locateText}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  locateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg - 2,
    backgroundColor: colors.accentPrimary,
    borderRadius: 999,
    minWidth: 140,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  locatePressed: { opacity: 0.9 },
  locateDisabled: { opacity: 0.7 },
  locateIcon: { fontSize: typography.sizes.sm + 3, marginRight: spacing.sm },
  locateText: {
    color: colors.textOnPrimary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  loader: { marginRight: spacing.sm },
});
