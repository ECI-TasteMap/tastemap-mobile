import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import UserLoginScreen from './src/screens/UserLoginScreen';
import RestaurantLoginScreen from './src/screens/RestaurantLoginScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/* <UserLoginScreen /> */}
      <RestaurantLoginScreen />
    </SafeAreaProvider>
  );
}
