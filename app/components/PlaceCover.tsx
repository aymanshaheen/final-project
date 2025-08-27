import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@styles';

export function PlaceCover({
  imageUrl,
}: {
  imageUrl?: string | null;
}): React.ReactElement {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.cover}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={[styles.cover, styles.coverPlaceholder]}>
      <Text style={styles.coverPlaceholderText}>No image</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 220,
    backgroundColor: colors.surface,
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    color: colors.white,
    fontWeight: '600',
  },
});
