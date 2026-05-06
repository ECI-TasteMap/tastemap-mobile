import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RestaurantBottomNavBar from './src/components/RestaurantBottomNavBar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
        <NavigationContainer>
            <RestaurantBottomNavBar />
        </NavigationContainer>
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