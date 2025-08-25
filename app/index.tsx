import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function App() {
  return <View style={styles.container} >
    <Text>Hello World</Text>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
