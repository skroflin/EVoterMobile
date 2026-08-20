// src/screens/auth/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Card from '../../components/Card';
import { resetPassword } from '../../api/api';
import { ResetPasswordRequest } from '../../types/auth.types';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Sva polja su obavezna.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Lozinka mora sadržavati najmanje 6 znakova.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requestPayload: ResetPasswordRequest = {
        code: code.trim(),
        newPassword,
        confirmPassword,
      };

      const response = await resetPassword(requestPayload);

      Alert.alert(
        'Lozinka uspješno promijenjena',
        response?.message || 'Sada se možete prijaviti s novom lozinkom.',
        [
          {
            text: 'Idi na prijavu',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Neispravan kod ili je istekao rok valjanosti. Pokušajte ponovno.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Postavljanje nove lozinke</Text>
            <Text style={styles.subtitle}>
              Unesite kod iz e-maila te potvrdite novu lozinku za svoj račun.
            </Text>
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.label}>Kod za oporavak *</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite kod iz e-maila"
              placeholderTextColor="#94A3B8"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (error) setError(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Nova lozinka *</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimalno 6 znakova"
              placeholderTextColor="#94A3B8"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Potvrda nove lozinke *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ponovno unesite novu lozinku"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry
              editable={!isSubmitting}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Spremi novu lozinku</Text>
              )}
            </TouchableOpacity>
          </Card>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Odustani i vrati se na prijavu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
});