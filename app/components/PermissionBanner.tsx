import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@styles';

type Props = {
  title: string;
  subtitle: string;
  cta: string;
  onPress: () => void;
  style?: ViewStyle;
};

export function PermissionBanner({
  title,
  subtitle,
  cta,
  onPress,
  style,
}: Props) {
  return (
    <View style={[styles.permissionBanner, style]} pointerEvents="box-none">
      <View style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionSubtitle}>{subtitle}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [
            styles.permissionButton,
            pressed && styles.fabPressed,
          ]}
        >
          <Text style={styles.permissionButtonText}>{cta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionBanner: {
    left: spacing.lg,
    right: spacing.lg,
  },
  permissionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  fabPressed: { opacity: 0.85 },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  permissionSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs + 2,
  },
  permissionButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md - 2,
    backgroundColor: colors.accentPrimary,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  permissionButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
