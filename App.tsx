import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RestaurantBottomNavBar from './src/components/RestaurantBottomNavBar';
import RestaurantNewLocal from './src/screens/RestaurantNewLocal';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RestaurantNewLocal />
      <RestaurantBottomNavBar />
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
