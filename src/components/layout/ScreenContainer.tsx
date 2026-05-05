import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenContainerStyles as styles } from './ScreenContainer.styles';

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
