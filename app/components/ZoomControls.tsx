import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@styles';

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  style?: ViewStyle;
};

export function ZoomControls({ onZoomIn, onZoomOut, style }: Props) {
  return (
    <View style={[styles.zoomGroup, style]}>
      <Pressable
        accessibilityRole="button"
        onPress={onZoomIn}
        style={({ pressed }) => [
          styles.zoomButton,
          pressed && styles.fabPressed,
        ]}
      >
        <Text style={styles.zoomText}>＋</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onZoomOut}
        style={({ pressed }) => [
          styles.zoomButton,
          pressed && styles.fabPressed,
        ]}
      >
        <Text style={styles.zoomText}>－</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  zoomGroup: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  zoomButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  zoomText: {
    fontSize: typography.sizes.lg + 2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  fabPressed: { opacity: 0.85 },
});
