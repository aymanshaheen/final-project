import React, { useCallback, useEffect, useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openSettings } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography } from '@styles';
import { useLocationPermission } from '@hooks/useLocationPermission';
import { Button } from '@components/Button';
import { Card } from '@components/Card';

export default function LocationPermissionScreen(): React.ReactElement | null {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { status, checkPermission, requestPermission } =
    useLocationPermission();

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    if (status === 'granted') {
      navigation.reset({ index: 0, routes: [{ name: 'Map' }] });
    }
  }, [status, navigation]);

  const title = useMemo(() => {
    if (status === 'granted') return 'Location Enabled';
    if (status === 'blocked') return 'Location Blocked';
    if (status === 'unavailable') return 'Location Unavailable';
    return 'Enable Location Access';
  }, [status]);

  const description = useMemo(() => {
    if (status === 'granted') {
      return 'Thanks! We will tailor content to your area.';
    }
    if (status === 'blocked') {
      return 'Location is blocked in settings. To continue, allow access in your device settings.';
    }
    if (status === 'unavailable') {
      return 'Location services are not available on this device.';
    }
    return 'We use your location to show nearby content and make recommendations relevant to where you are.';
  }, [status]);

  const primaryCta = useMemo(() => {
    if (status === 'granted') return 'Continue';
    if (status === 'blocked') return 'Open Settings';
    if (status === 'unavailable') return 'Learn More';
    if (status === 'denied') return 'Allow Location';
    return 'Allow Location';
  }, [status]);

  const onPrimaryPress = useCallback(async () => {
    if (status === 'granted') {
      navigation.reset({ index: 0, routes: [{ name: 'Map' }] });
      return;
    }
    if (status === 'blocked') {
      try {
        await openSettings();
      } catch (e) {
        Linking.openSettings?.();
      }
      return;
    }
    if (status === 'unavailable') {
      Linking.openURL('https://support.google.com/accounts/answer/3467281');
      return;
    }
    await requestPermission();
  }, [status, requestPermission]);

  const secondaryCta = useMemo(() => {
    if (status === 'granted') return undefined;
    return 'Not now';
  }, [status]);

  const onSecondaryPress = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Map' }] });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Card>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{description}</Text>

          <View style={styles.buttonsRow}>
            {secondaryCta ? (
              <Button
                title={secondaryCta}
                onPress={onSecondaryPress}
                variant="secondary"
              />
            ) : null}
            <Button
              title={primaryCta}
              onPress={onPrimaryPress}
              variant="primary"
            />
          </View>

          {status === 'denied' ? (
            <Text style={styles.helper}>
              You can enable location anytime. We only use it while the app is
              in use.
            </Text>
          ) : null}
          {status === 'granted' ? (
            <Text style={styles.helper}>
              Great! You can manage this later in Settings.
            </Text>
          ) : null}
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundPrimary },
  container: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.accentPrimaryAlpha15,
  },
  icon: {
    fontSize: typography.sizes.icon,
  },
  title: {
    fontSize: typography.sizes.h4,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.lineHeights.normal,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  helper: {
    marginTop: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: typography.sizes.sm,
  },
});
