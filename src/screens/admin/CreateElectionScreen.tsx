import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Card from '../../components/Card';
import { createElection } from '../../api/api';
import { ElectionRequest, CandidateRequest } from '../../types/election.types';

export default function CreateElectionScreen() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [candidateName, setCandidateName] = useState('');
  const [candidateBio, setCandidateBio] = useState('');

  const [candidates, setCandidates] = useState<CandidateRequest[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCandidate = () => {
    if (!candidateName.trim()) {
      Alert.alert('Greška', 'Ime kandidata ne smije biti prazno.');
      return;
    }

    const newCandidate: CandidateRequest = {
      name: candidateName.trim(),
      bio: candidateBio.trim(),
    };

    setCandidates((prev) => [...prev, newCandidate]);
    setCandidateName('');
    setCandidateBio('');
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Naslov izbora je obavezan.');
      return;
    }

    if (!startDate.trim() || !endDate.trim()) {
      setError('Početni i završni datum su obavezni (ISO format: YYYY-MM-DDTHH:mm:ss).');
      return;
    }

    if (candidates.length < 2) {
      setError('Izbori moraju sadržavati najmanje 2 kandidata.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requestPayload: ElectionRequest = {
        title: title.trim(),
        description: description.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        candidates,
      };

      await createElection(requestPayload);

      Alert.alert('Uspjeh', 'Izbori su uspješno kreirani!', [
        {
          text: 'U redu',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Došlo je do pogreške prilikom kreiranja izbora.';
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
            <Text style={styles.title}>Kreiraj nove izbore</Text>
            <Text style={styles.subtitle}>
              Unesite pojedinosti izbora i dodajte kandidate
            </Text>
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Sekcija 1: Detalji izbora */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Informacije o izborima</Text>

            <Text style={styles.label}>Naslov izbora *</Text>
            <TextInput
              style={styles.input}
              placeholder="Npr. Izbori za Studentski zbor 2026"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Opis izbora</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Unesite opis ili pravila izbora..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Početak (ISO String) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-09-01T08:00:00"
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.label}>Kraj (ISO String) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-09-02T20:00:00"
              value={endDate}
              onChangeText={setEndDate}
            />
          </Card>

          {/* Sekcija 2: Kandidati */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>
              Popis kandidata ({candidates.length})
            </Text>

            <View style={styles.addCandidateBox}>
              <Text style={styles.label}>Ime i prezime kandidata *</Text>
              <TextInput
                style={styles.input}
                placeholder="Npr. Marko Marković"
                value={candidateName}
                onChangeText={setCandidateName}
              />

              <Text style={styles.label}>Biografija / Opis</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Kratki opis kandidata..."
                value={candidateBio}
                onChangeText={setCandidateBio}
                multiline
                numberOfLines={2}
              />

              <TouchableOpacity
                style={styles.addCandidateButton}
                onPress={handleAddCandidate}
                activeOpacity={0.8}
              >
                <Text style={styles.addCandidateButtonText}>
                  + Dodaj kandidata na listu
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista dodanih kandidata */}
            {candidates.map((item, index) => (
              <View key={index} style={styles.candidateRow}>
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>
                    {index + 1}. {item.name}
                  </Text>
                  {item.bio ? (
                    <Text style={styles.candidateBio}>{item.bio}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveCandidate(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Ukloni</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Card>

          {/* Akcijski gumb */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Kreiraj izbore</Text>
            )}
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  addCandidateBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  addCandidateButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  addCandidateButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  candidateInfo: {
    flex: 1,
    marginRight: 10,
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  candidateBio: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});