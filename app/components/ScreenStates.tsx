import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing } from '@styles';

export function LoadingState({ text }: { text?: string }): React.ReactElement {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.accentPrimary} />
      {text ? <Text style={styles.loadingText}>{text}</Text> : null}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): React.ReactElement {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EmptyState({
  title = 'No results',
  subtitle = 'Try adjusting filters or zooming the map.',
}: {
  title?: string;
  subtitle?: string;
}): React.ReactElement {
  return (
    <View style={styles.centered}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export function ListSkeleton({
  count = 5,
}: {
  count?: number;
}): React.ReactElement {
  return (
    <View style={styles.skeletonListContainer} pointerEvents="none">
      {Array.from({ length: count }).map((_, idx) => (
        <View key={`sk-${idx}`} style={styles.skeletonCard}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonMeta} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    color: colors.textSecondary,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.accentPrimary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  skeletonListContainer: {
    gap: spacing.sm,
    padding: spacing.sm,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  skeletonTitle: {
    height: 16,
    borderRadius: 6,
    backgroundColor: colors.borderSubtle,
    marginBottom: spacing.xs,
    width: '70%',
  },
  skeletonMeta: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.borderSubtle,
    width: '50%',
  },
});
