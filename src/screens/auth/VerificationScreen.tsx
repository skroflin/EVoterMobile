import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import VerificationCodeCard from '../../components/VerificationCodeCard';
import { verifyUser } from '../../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

interface VerificationScreenProps {
  email: string;
  onVerificationSuccess?: () => void;
}

export default function VerificationScreen({
  email,
  onVerificationSuccess,
}: VerificationScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async (code: string) => {
    setLoading(true);

    try {
      const response = await verifyUser({ email, code });
      Alert.alert('Uspjeh', response.message || 'Kod je uspješno verificiran!');
      onVerificationSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Neispravan verifikacijski kod ili greška pri komunikaciji sa serverom.';
      Alert.alert('Greška', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <VerificationCodeCard
            onVerify={handleVerify}
            isLoading={loading}
          />
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
});