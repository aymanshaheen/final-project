import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Root application component. Keep this minimal; real features live under `app/` folders.
 */
export default function App() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
