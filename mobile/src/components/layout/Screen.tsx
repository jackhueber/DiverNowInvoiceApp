import React, { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme/tokens';

type ScreenProps = {
  children: ReactNode;
  /** Optional additional styles for the content container. */
  contentStyle?: ViewStyle | ViewStyle[];
};

export const Screen = ({ children, contentStyle }: ScreenProps) => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});

