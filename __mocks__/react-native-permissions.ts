export const RESULTS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNAVAILABLE: 'unavailable',
} as const;

export const PERMISSIONS = {
  IOS: { LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE' },
  ANDROID: { ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION' },
} as const;

export async function check() {
  return RESULTS.GRANTED;
}

export async function request() {
  return RESULTS.GRANTED;
}

export async function openSettings() {
  return true;
}

export default {
  RESULTS,
  PERMISSIONS,
  check,
  request,
  openSettings,
};
