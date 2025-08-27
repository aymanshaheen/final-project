import React, { PropsWithChildren } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '@styles';

type Props = PropsWithChildren<{
  pulseOpacity:
    | Animated.AnimatedInterpolation<string | number>
    | Animated.Value;
  pulseScale: Animated.AnimatedInterpolation<string | number> | Animated.Value;
}>;

export function UserMarker({ pulseOpacity, pulseScale }: Props) {
  return (
    <View style={styles.markerWrapper}>
      <Animated.View
        style={[
          styles.pulse,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale as any }],
          },
        ]}
      />
      <View style={styles.markerDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  pulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentPrimaryAlpha35,
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accentPrimary,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
