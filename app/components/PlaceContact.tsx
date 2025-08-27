import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing } from '@styles';

type Props = {
  phone?: string | null;
  website?: string | null;
};

export function PlaceContact({
  phone,
  website,
}: Props): React.ReactElement | null {
  if (!phone && !website) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact</Text>
      {!!phone && (
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${phone}`)}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>{phone}</Text>
        </TouchableOpacity>
      )}
      {!!website && (
        <TouchableOpacity
          onPress={() => Linking.openURL(website as string)}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>{website}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  linkText: {
    color: colors.accentPrimary,
  },
});
