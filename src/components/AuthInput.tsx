import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { authStyles } from '../styles/authStyles';

interface AuthInputProps extends TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...rest
}: AuthInputProps) {
  return (
    <View style={authStyles.inputGroup}>
      <Text style={authStyles.inputLabel}>{label}</Text>
      <TextInput
        style={authStyles.textInput}
        placeholder={placeholder}
        placeholderTextColor={authStyles.textInputPlaceholder.color}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        {...rest}
      />
    </View>
  );
}
