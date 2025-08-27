import { useCallback, useMemo, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export type PermissionState =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export function useLocationPermission() {
  const [status, setStatus] = useState<PermissionState>('idle');

  const permission = useMemo(() => {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    }
    return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }, []);

  const checkPermission = useCallback(async () => {
    setStatus('checking');
    try {
      const result = await check(permission);
      switch (result) {
        case RESULTS.GRANTED:
          setStatus('granted');
          break;
        case RESULTS.DENIED:
          setStatus('denied');
          break;
        case RESULTS.BLOCKED:
          setStatus('blocked');
          break;
        case RESULTS.UNAVAILABLE:
          setStatus('unavailable');
          break;
        default:
          setStatus('denied');
      }
    } catch {
      setStatus('denied');
    }
  }, [permission]);

  const requestPermission = useCallback(async () => {
    setStatus('checking');
    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        setStatus('granted');
      } else if (result === RESULTS.BLOCKED) {
        setStatus('blocked');
      } else if (result === RESULTS.DENIED) {
        setStatus('denied');
      } else if (result === RESULTS.UNAVAILABLE) {
        setStatus('unavailable');
      } else {
        setStatus('denied');
      }
    } catch {
      setStatus('denied');
    }
  }, [permission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { status, checkPermission, requestPermission } as const;
}
