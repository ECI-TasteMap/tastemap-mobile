import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BottomNavBar from './src/components/BottomNavBar';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ProfileScreen />
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1D32',
  },
});
