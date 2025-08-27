import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useMapPulse() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [pulse]);

  const scalePulse = useMemo(
    () =>
      pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.2],
      }),
    [pulse],
  );

  const fadePulse = useMemo(
    () =>
      pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0],
      }),
    [pulse],
  );

  return { fadePulse, scalePulse } as const;
}
