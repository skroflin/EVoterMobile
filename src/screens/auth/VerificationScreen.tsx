import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import VerificationCodeCard from '../../components/VerificationCodeCard';
import { verifyUser } from '../../api/api';
import { AuthStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

export default function VerificationScreen({ route, navigation }: Props) {
  const email = route.params?.email || '';
  const [loading, setLoading] = useState(false);

  const handleVerify = async (code: string) => {
    if (!code || code.trim() === '') {
      (Toast as any).error('Please enter the verification code.');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyUser({ email, code });
      (Toast as any).success(
        response?.message || 'Account verified successfully!'
      );
      navigation.navigate('Login' as any);
    } catch (error: any) {
      const apiError = error?.response?.data;
      
      const errorMessage =
        typeof apiError === 'string'
          ? apiError
          : apiError?.message ||
            'Invalid verification code or server communication error.';

      (Toast as any).error(errorMessage);
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