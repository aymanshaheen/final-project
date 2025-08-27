import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@styles';

type HoursItem = { day: string; value: string };

export function PlaceHours({
  items,
}: {
  items: HoursItem[];
}): React.ReactElement | null {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hours</Text>
      {items.map(item => (
        <View key={item.day} style={styles.hoursRow}>
          <Text style={styles.hoursDay}>{capitalize(item.day)}</Text>
          <Text style={styles.hoursValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hoursDay: {
    color: colors.textPrimary,
  },
  hoursValue: {
    color: colors.textSecondary,
  },
});
