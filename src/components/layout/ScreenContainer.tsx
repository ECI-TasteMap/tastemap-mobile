import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenContainerStyles as styles } from './ScreenContainer.styles';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  useSafeArea?: boolean;
  noPadding?: boolean;
}

export default function ScreenContainer({
  children,
  style,
  contentStyle,
  useSafeArea = true,
  noPadding = false,
}: Readonly<ScreenContainerProps>) {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]}>
      <View style={[styles.content, noPadding && styles.contentNoPadding, contentStyle]}>
        {children}
      </View>
    </Container>
  );
}
