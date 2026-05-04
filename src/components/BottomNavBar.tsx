import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'search', label: 'Buscar', icon: 'search' },
  { id: 'ia', label: 'IA', icon: 'sparkles' },
  { id: 'reservas', label: 'Reservas', icon: 'calendar' },
  { id: 'perfil', label: 'Perfil', icon: 'person' },
];
export default function BottomNavBar() {
  const [tabActiva, setTabActiva] = useState('home');

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, tab.id === 'ia' && styles.tabIA]}
          onPress={() => setTabActiva(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={
              tab.id === 'ia'
                ? '#FF6B35'
                : tabActiva === tab.id
                  ? '#c9a96e'
                  : 'rgba(240,234,220,0.4)'
            }
          />
          <Text
            style={[
              styles.label,
              tabActiva === tab.id && styles.labelActiva,
              tab.id === 'ia' && { display: 'none' },
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
  },
  tabIA: {
    flex: 0,
    backgroundColor: '#e8c170',
    width: 56,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 15,
  },
});
