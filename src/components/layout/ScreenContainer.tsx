import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
}

export default function ScreenContainer({
  children,
  style,
  useSafeArea = true,
}: ScreenContainerProps) {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1D32',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
});
