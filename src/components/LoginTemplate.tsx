import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthInput from './AuthInput';
import { authStyles } from '../styles/authStyles';

interface LoginTemplateProps {
  mode: 'user' | 'restaurant';
  headerBackgroundColor: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  mainTitle: string;
  mainSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  primaryButtonText: string;
  primaryButtonColor: string;
  secondaryButtonText: string;
  footerText?: string;
  footerActionText?: string;
  footerActionColor?: string;
  footerSecondaryText?: string;
  footerSecondaryActionText?: string;
  footerSecondaryActionColor?: string;
  onPrimaryPress?: (email: string, password?: string) => void;
  onSecondaryPress?: () => void;
  onFooterActionPress?: () => void;
  onFooterSecondaryActionPress?: () => void;
}

export default function LoginTemplate({
  mode,
  headerBackgroundColor,
  title,
  subtitle,
  badgeText,
  mainTitle,
  mainSubtitle,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  primaryButtonText,
  primaryButtonColor,
  secondaryButtonText,
  footerText,
  footerActionText,
  footerActionColor,
  footerSecondaryText,
  footerSecondaryActionText,
  footerSecondaryActionColor,
  onPrimaryPress,
  onSecondaryPress,
  onFooterActionPress,
  onFooterSecondaryActionPress,
}: LoginTemplateProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress(email, password || undefined);
    } else {
      console.log(`${mode} login attempt`);
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    } else {
      console.log(`${mode} secondary action`);
    }
  };

  const handleFooterActionPress = () => {
    if (onFooterActionPress) {
      onFooterActionPress();
    } else {
      console.log(`${mode} footer action`);
    }
  };

  const handleFooterSecondaryActionPress = () => {
    if (onFooterSecondaryActionPress) {
      onFooterSecondaryActionPress();
    } else {
      console.log(`${mode} footer secondary action`);
    }
  };

  const primaryButtonStyle = [
    authStyles.primaryButton,
    { backgroundColor: primaryButtonColor },
    mode === 'user' && authStyles.primaryButtonGold,
    mode === 'restaurant' && authStyles.primaryButtonGreen,
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ScrollView
        contentContainerStyle={[authStyles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
      >
        {/* Header */}
        <View
          style={[
            authStyles.header,
            {
              backgroundColor: headerBackgroundColor,
              paddingTop: insets.top + 16,
            },
          ]}
        >
          <Text style={authStyles.tasteMapTitle}>{title}</Text>
          {badgeText && (
            <View style={authStyles.badgeContainer}>
              <Text style={authStyles.badge}>{badgeText}</Text>
            </View>
          )}
          <View style={authStyles.headerDivider} />
          <Text style={authStyles.headerSubtitle}>{subtitle}</Text>
        </View>

        {/* Form */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.mainTitle}>{mainTitle}</Text>
          <Text style={authStyles.mainSubtitle}>{mainSubtitle}</Text>

          {/* Email Input */}
          <AuthInput
            label={emailLabel}
            placeholder={emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          {passwordLabel && passwordPlaceholder && (
            <AuthInput
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={primaryButtonStyle}
            activeOpacity={0.8}
            onPress={handlePrimaryPress}
          >
            <Text style={authStyles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={authStyles.dividerContainer}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>o</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Secondary Button */}
          <TouchableOpacity
            style={authStyles.secondaryButton}
            activeOpacity={0.6}
            onPress={handleSecondaryPress}
          >
            <Text style={authStyles.secondaryButtonText}>{secondaryButtonText}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={authStyles.footerContainer}>
          {footerText && footerActionText && (
            <Text style={authStyles.footerText}>
              {footerText}{' '}
              <Text
                style={[
                  authStyles.footerText,
                  authStyles.footerActionText,
                  footerActionColor && { color: footerActionColor },
                ]}
                onPress={handleFooterActionPress}
              >
                {footerActionText}
              </Text>
            </Text>
          )}

          {footerSecondaryText && footerSecondaryActionText && (
            <Text style={authStyles.footerText}>
              {footerSecondaryText}{' '}
              <Text
                style={[
                  authStyles.footerText,
                  authStyles.footerActionText,
                  footerSecondaryActionColor && { color: footerSecondaryActionColor },
                ]}
                onPress={handleFooterSecondaryActionPress}
              >
                {footerSecondaryActionText}
              </Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
