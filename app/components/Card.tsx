import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '@styles';

type Props = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({ children, style }: Props): React.ReactElement {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg + 6,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
});
