import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BottomNavBar from './src/components/BottomNavBar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1D32',
    justifyContent: 'flex-end',
  },
});
