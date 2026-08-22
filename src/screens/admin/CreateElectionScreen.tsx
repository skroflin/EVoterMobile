import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import Card from '../../components/Card';
import { createElection } from '../../api/api';
import { ElectionRequest } from '../../types/election.types';

interface CandidateInput {
  name: string;
  description: string;
}

export default function CreateElectionScreen() {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() + 5 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const [showPicker, setShowPicker] = useState<{
    target: 'start' | 'end';
    mode: 'date' | 'time';
  } | null>(null);

  const [candidates, setCandidates] = useState<CandidateInput[]>([
    { name: '', description: '' },
    { name: '', description: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setShowPicker(null);
      return;
    }

    if (showPicker?.target === 'start') {
      setStartDate(selectedDate);
      if (selectedDate >= endDate) {
        setEndDate(new Date(selectedDate.getTime() + 4 * 60 * 60 * 1000));
      }
    } else if (showPicker?.target === 'end') {
      if (selectedDate <= startDate) {
        Toast.show({
          type: 'error',
          text1: 'Election end date must be after the start date.',
        });
        setShowPicker(null);
        return;
      }
      setEndDate(selectedDate);
    }

    if (Platform.OS === 'android') {
      setShowPicker(null);
    }
  };

  const handleCandidateChange = (index: number, field: keyof CandidateInput, value: string) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate, i) =>
        i === index ? { ...candidate, [field]: value } : candidate
      )
    );
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', description: '' }]);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length <= 2) {
      Toast.show({
        type: 'error',
        text1: 'Elections must have at least 2 candidates.',
      });
      return;
    }
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const validateForm = (): string | null => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return 'Election title is required.';
    }
    if (trimmedTitle.length < 100 || trimmedTitle.length > 500) {
      return `Election title must be between 100 and 500 characters (currently: ${trimmedTitle.length}).`;
    }

    if (!trimmedDescription) {
      return 'Election description is required.';
    }
    if (trimmedDescription.length < 500 || trimmedDescription.length > 2000) {
      return `Election description must be between 500 and 2000 characters (currently: ${trimmedDescription.length}).`;
    }

    if (startDate <= new Date()) {
      return 'Election start time must be in the future.';
    }

    if (endDate <= startDate) {
      return 'Election end date must be after the start date.';
    }

    const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    if (durationInMinutes < 240) {
      return 'Election must be at least 4 hours.';
    }

    if (candidates.length < 2) {
      return 'Names for at least 2 candidates must be provided.';
    }

    for (let i = 0; i < candidates.length; i++) {
      const name = candidates[i].name.trim();
      const bio = candidates[i].description.trim();

      if (!name) {
        return `Candidate #${i + 1} name is required.`;
      }
      if (name.length < 2 || name.length > 50) {
        return `Candidate #${i + 1} name must be between 2 and 50 characters.`;
      }

      if (!bio) {
        return `Candidate #${i + 1} biography is required.`;
      }
      if (bio.length > 500) {
        return `Candidate #${i + 1} biography cannot exceed 500 characters.`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      Toast.show({
        type: 'error',
        text1: validationError,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requestPayload: ElectionRequest = {
        title: title.trim(),
        description: description.trim(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        candidates: candidates.map((c) => ({
          name: c.name.trim(),
          bio: c.description.trim(),
        })),
      };

      await createElection(requestPayload);

      Toast.show({
        type: 'success',
        text1: 'New election successfully created!',
      });
      navigation.navigate('ElectionListTab');
    } catch (err: any) {
      const apiError = err?.response?.data;
      const msg =
        typeof apiError === 'string'
          ? apiError
          : apiError?.message || 'An error occurred while creating the election.';

      setError(msg);
      Toast.show({
        type: 'error',
        text1: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.screenTitle}>Create New Election</Text>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>Basic Information</Text>

            <View style={styles.labelRow}>
              <Text style={styles.label}>Election Title *</Text>
              <Text style={styles.charCount}>{title.trim().length}/500 (min 100)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter election title (at least 100 characters)..."
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
              maxLength={500}
            />

            <View style={styles.labelRow}>
              <Text style={styles.label}>Election Description *</Text>
              <Text style={styles.charCount}>{description.trim().length}/2000 (min 500)</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detailed description and election rules (at least 500 characters)..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={2000}
            />
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionHeader}>Duration</Text>

            <Text style={styles.label}>Election Start</Text>
            <View style={styles.datePickerRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker({ target: 'start', mode: 'date' })}
              >
                <Calendar size={18} color="#2563EB" />
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeIconButton}
                onPress={() => setShowPicker({ target: 'start', mode: 'time' })}
              >
                <Clock size={18} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Election End</Text>
            <View style={styles.datePickerRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker({ target: 'end', mode: 'date' })}
              >
                <Calendar size={18} color="#2563EB" />
                <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeIconButton}
                onPress={() => setShowPicker({ target: 'end', mode: 'time' })}
              >
                <Clock size={18} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={showPicker.target === 'start' ? startDate : endDate}
                mode={showPicker.mode}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={showPicker.target === 'end' ? startDate : new Date()}
              />
            )}
            {Platform.OS === 'ios' && showPicker && (
              <TouchableOpacity
                style={styles.closePickerButton}
                onPress={() => setShowPicker(null)}
              >
                <Text style={styles.closePickerText}>Confirm Selection</Text>
              </TouchableOpacity>
            )}
          </Card>

          <Card style={styles.card}>
            <View style={styles.candidateHeaderRow}>
              <Text style={styles.sectionHeader}>Candidates ({candidates.length})</Text>
              <TouchableOpacity style={styles.addCandidateButton} onPress={addCandidate}>
                <Plus size={16} color="#2563EB" />
                <Text style={styles.addCandidateText}>Add</Text>
              </TouchableOpacity>
            </View>

            {candidates.map((candidate, index) => (
              <View key={index} style={styles.candidateItem}>
                <View style={styles.candidateTopRow}>
                  <Text style={styles.candidateNumber}># {index + 1}</Text>
                  {candidates.length > 2 && (
                    <TouchableOpacity onPress={() => removeCandidate(index)}>
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.labelRow}>
                  <Text style={styles.label}>Full Name *</Text>
                  <Text style={styles.charCount}>{candidate.name.trim().length}/50</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Candidate full name (2 - 50 characters) *"
                  placeholderTextColor="#94A3B8"
                  value={candidate.name}
                  onChangeText={(val) => handleCandidateChange(index, 'name', val)}
                  maxLength={50}
                />

                <View style={styles.labelRow}>
                  <Text style={styles.label}>Biography *</Text>
                  <Text style={styles.charCount}>{candidate.description.trim().length}/500</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.textAreaCandidate]}
                  placeholder="Short candidate biography (up to 500 characters) *"
                  placeholderTextColor="#94A3B8"
                  value={candidate.description}
                  onChangeText={(val) => handleCandidateChange(index, 'description', val)}
                  multiline
                  maxLength={500}
                />
              </View>
            ))}
          </Card>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Election</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  charCount: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
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
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  textAreaCandidate: {
    height: 60,
    textAlignVertical: 'top',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  timeIconButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePickerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  closePickerText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  candidateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCandidateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addCandidateText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  candidateItem: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  candidateTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  candidateNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
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
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
});