import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'UserLogin'>;

export default function UserLoginScreen() {
  const navigation = useNavigation<Nav>();
  const { sendOtp, verifyOtp } = useAuth();
  const [sent, setSent]   = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp]     = useState('');

  const handleSend = async (emailValue: string) => {
    if (!emailValue) return Alert.alert('Error', 'Ingresa tu correo');
    setEmail(emailValue);
    const { error } = await sendOtp(emailValue);
    if (error) Alert.alert('Error', error.message);
    else setSent(true);
  };

  const handleVerify = async () => {
    if (!otp) return Alert.alert('Error', 'Ingresa el código');
    const { error } = await verifyOtp(email, otp);
    if (error) Alert.alert('Código incorrecto', error.message);
  };

  if (sent) return (
    <View style={styles.container}>
      <Text style={styles.title}>Revisa tu correo 📬</Text>
      <Text style={styles.subtitle}>Ingresa el código de 6 dígitos enviado a {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={8}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verificar código</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSent(false)}>
        <Text style={styles.back}>← Cambiar correo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LoginTemplate
      mode="user"
      headerBackgroundColor={colors.headerNavy}
      title="TasteMap"
      subtitle="Descubre tu lugar perfecto"
      mainTitle="Bienvenido 👋"
      mainSubtitle="Inicia sesión para continuar"
      emailLabel="CORREO ELECTRÓNICO"
      emailPlaceholder="tu@correo.com"
      primaryButtonText="Enviar código →"
      primaryButtonColor={colors.gold}
      secondaryButtonText="Crear cuenta nueva"
      footerSecondaryText="¿Dueño de restaurante?"
      footerSecondaryActionText="Accede aquí →"
      footerSecondaryActionColor={colors.teal}
      onPrimaryPress={handleSend}
      onSecondaryPress={() => {}}
      onFooterSecondaryActionPress={() => navigation.navigate('RestaurantLogin')}
    />
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title:      { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle:   { fontSize: 14, color: '#666', marginBottom: 24 },
  input:      { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 14, fontSize: 24, letterSpacing: 8, textAlign: 'center', marginBottom: 16 },
  button:     { backgroundColor: colors.gold, borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  back:       { color: '#666', textAlign: 'center', marginTop: 8 }
});