import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Card from '../../components/Card';
import { forgotPassword } from '../../api/api';
import { ForgotPasswordRequest } from '../../types/auth.types';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Molimo unesite e-mail adresu.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Unesite ispravnu e-mail adresu.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const requestPayload: ForgotPasswordRequest = {
        email: email.trim(),
      };

      const response = await forgotPassword(requestPayload);

      setSuccessMessage(
        response?.message || 'Upute za oporavak lozinke poslane su na vaš e-mail.'
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Došlo je do pogreške prilikom slanja zahtjeva. Pokušajte ponovno.';
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
            <Text style={styles.title}>Zaboravljena lozinka</Text>
            <Text style={styles.subtitle}>
              Unesite e-mail adresu povezanu s vašim računom kako bismo vam poslali kod za ponovno postavljanje lozinke.
            </Text>
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {successMessage && (
            <View style={styles.successCard}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.label}>E-mail adresa *</Text>
            <TextInput
              style={styles.input}
              placeholder="korisnik@domena.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!email.trim() || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!email.trim() || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Pošalji zahtjev</Text>
              )}
            </TouchableOpacity>
          </Card>

          <View style={styles.navigationContainer}>
            {successMessage && (
              <TouchableOpacity
                style={styles.resetNavButton}
                onPress={() =>
                  navigation.navigate('ResetPassword', { email: email.trim() })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.resetNavButtonText}>
                  Unesite kod i ponovno postavite lozinku →
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>Povratak na prijavu</Text>
            </TouchableOpacity>
          </View>
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
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
  successCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#166534',
    fontSize: 13,
    textAlign: 'center',
  },
  navigationContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  resetNavButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetNavButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
});