import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { IconOutline } from '@ant-design/icons-react-native';
import { useNavigation } from '@react-navigation/native';

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

    const [startDate, setStartDate] = useState<Date>(new Date());
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
                setEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000));
            }
        } else if (showPicker?.target === 'end') {
            if (selectedDate <= startDate) {
                Alert.alert('Nevažeći datum', 'Završetak izbora mora biti nakon početka.');
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
            Alert.alert('Upozorenje', 'Izbori moraju imati najmanje 2 kandidata.');
            return;
        }
        setCandidates(candidates.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            setError('Molimo unesite naziv i opis izbora.');
            return;
        }

        // Provjera praznih imena kandidata prije slanja
        const hasEmptyCandidate = candidates.some((c) => !c.name.trim());
        if (hasEmptyCandidate) {
            setError('Svi dodani kandidati moraju imati uneseno ime.');
            return;
        }

        if (candidates.length < 2) {
            setError('Morate unijeti nazive za najmanje 2 kandidata.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const requestPayload: ElectionRequest = {
                title: title.trim(),
                description: description.trim(),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                candidates: candidates.map((c) => ({
                    name: c.name.trim(),
                    bio: c.description.trim(),
                })),
            };

            await createElection(requestPayload);

            Alert.alert('Uspjeh', 'Novi izbori su uspješno kreirani!', [
                {
                    text: 'U redu',
                    onPress: () => navigation.navigate('ElectionListTab'),
                },
            ]);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Došlo je do pogreške prilikom kreiranja izbora.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString('hr-HR', {
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
                    <Text style={styles.screenTitle}>Kreiraj nove izbore</Text>

                    {error && (
                        <View style={styles.errorCard}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <Card style={styles.card}>
                        <Text style={styles.sectionHeader}>Osnovne informacije</Text>

                        <Text style={styles.label}>Naziv izbora *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="npr. Izbori za Studentski zbor 2026."
                            placeholderTextColor="#94A3B8"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.label}>Opis izbora *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detaljan opis i pravila izbora..."
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </Card>

                    <Card style={styles.card}>
                        <Text style={styles.sectionHeader}>Vrijeme trajanja</Text>

                        <Text style={styles.label}>Početak izbora</Text>
                        <View style={styles.datePickerRow}>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowPicker({ target: 'start', mode: 'date' })}
                            >
                                <IconOutline name="calendar" size={18} color="#2563EB" />
                                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.timeIconButton}
                                onPress={() => setShowPicker({ target: 'start', mode: 'time' })}
                            >
                                <IconOutline name="clock-circle" size={18} color="#2563EB" />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { marginTop: 12 }]}>Završetak izbora</Text>
                        <View style={styles.datePickerRow}>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowPicker({ target: 'end', mode: 'date' })}
                            >
                                <IconOutline name="calendar" size={18} color="#2563EB" />
                                <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.timeIconButton}
                                onPress={() => setShowPicker({ target: 'end', mode: 'time' })}
                            >
                                <IconOutline name="clock-circle" size={18} color="#2563EB" />
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
                                <Text style={styles.closePickerText}>Potvrdi odabir</Text>
                            </TouchableOpacity>
                        )}
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.candidateHeaderRow}>
                            <Text style={styles.sectionHeader}>Kandidati ({candidates.length})</Text>
                            <TouchableOpacity style={styles.addCandidateButton} onPress={addCandidate}>
                                <IconOutline name="plus" size={16} color="#2563EB" />
                                <Text style={styles.addCandidateText}>Dodaj</Text>
                            </TouchableOpacity>
                        </View>

                        {candidates.map((candidate, index) => (
                            <View key={index} style={styles.candidateItem}>
                                <View style={styles.candidateTopRow}>
                                    <Text style={styles.candidateNumber}># {index + 1}</Text>
                                    {candidates.length > 2 && (
                                        <TouchableOpacity onPress={() => removeCandidate(index)}>
                                            <IconOutline name="delete" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder={`Ime i prezime kandidata *`}
                                    placeholderTextColor="#94A3B8"
                                    value={candidate.name}
                                    onChangeText={(val) => handleCandidateChange(index, 'name', val)}
                                />
                                <TextInput
                                    style={[styles.input, { marginTop: 6 }]}
                                    placeholder="Kratki opis / biografija kandidata (opcionalno)"
                                    placeholderTextColor="#94A3B8"
                                    value={candidate.description}
                                    onChangeText={(val) => handleCandidateChange(index, 'description', val)}
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
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#475569',
        marginBottom: 6,
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
        height: 80,
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