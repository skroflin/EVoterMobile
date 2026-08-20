import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card  from './ElectionCard';
import Input from './Input';
import Button from './Button';

interface Props {
  onVerify: (code: string) => void;
  isLoading?: boolean;
}

export default function VerificationCodeCard({ onVerify, isLoading = false }: Props) {
  const [code, setCode] = useState('');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconPlaceholder}>
          <Text style={styles.envelopeIcon}>✉</Text>
        </View>
        <Text style={styles.title}>e-Voting System verification code.</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.greeting}>Dear user,</Text>
        <Text style={styles.message}>
          we received a request to verify your account.{'\n'}
          Your one-time verification code is:
        </Text>
      </View>

      <Input
        placeholder="Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.codeInput}
      />

      <Button
        title={isLoading ? 'Verificiramo...' : 'The code is valid for 15 minutes'}
        onPress={() => onVerify(code)}
        disabled={!code.trim() || isLoading}
        loading={isLoading}
        style={styles.verifyButton}
      />

      <Text style={styles.footerText}>
        This is an automated message. Please do not reply to this email.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconPlaceholder: {
    marginBottom: 8,
  },
  envelopeIcon: {
    fontSize: 32,
    color: '#0F172A',
  },
  title: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  body: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '700',
    fontSize: 16,
  },
  verifyButton: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#1E90FF',
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});