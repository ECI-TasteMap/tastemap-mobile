import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'stats-chart' },
  { id: 'reservation', label: 'Reservas', icon: 'reader' },
  { id: 'local', label: 'Mi local', icon: 'restaurant' },
  { id: 'perfil', label: 'Perfil', icon: 'person' },
];
export default function RestaurantBottomNavBar() {
  const [tabActiva, setTabActiva] = useState('home');

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => setTabActiva(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={
              tabActiva === tab.id
                ? '#c9a96e'
                : 'rgba(240,234,220,0.4)'
            }
          />
          <Text
            style={[
              styles.label,
              tabActiva === tab.id && styles.labelActiva,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#091727',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#3f4a5e',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(240, 220, 233, 0.4)',
    fontSize: 11,
  },
  labelActiva: {
    color: '#c9a96e',
  }
});
