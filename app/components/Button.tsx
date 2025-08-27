import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '@styles';

type ButtonVariant = 'primary' | 'secondary';

type Props = {
  title: string;
  onPress: () => void;
  accessibilityRole?: 'button';
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  accessibilityRole = 'button',
  style,
  textStyle,
}: Props): React.ReactElement {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minWidth: 130,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.accentPrimary,
  },
  secondary: {
    backgroundColor: colors.surfaceSubtle,
  },
  text: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  primaryText: {
    color: colors.textOnPrimary,
  },
  secondaryText: {
    color: colors.textMuted,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.7 },
});
