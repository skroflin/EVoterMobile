import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import CandidateCard from '../../components/CandidateCard';
import Button from '../../components/Button';
import UpdateStatusModal from '../../components/UpdateStatusModal';
import { getElectionById, updateElectionStatus } from '../../api/api';
import { ElectionStatus, ElectionResponse } from '../../types/election.types';
import { MainStackParamList } from '../../navigation/RootNavigator';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<MainStackParamList, 'ElectionDetails'>;

const STATUS_TO_INT: Record<string, number> = {
  PREPARATION: 0,
  ACTIVE: 1,
  CLOSED: 2,
};

export default function ElectionDetailsScreen({ route, navigation }: Props) {
  const { electionId } = route.params;

  // Provjera uloge putem Zustand store-a
  const role = useAuthStore((state) => state.role);
  const isAdmin = role ? role.toUpperCase().includes('ADMIN') : false;

  const [election, setElection] = useState<ElectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchElectionDetails();
  }, [electionId]);

  const fetchElectionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getElectionById(electionId);
      setElection(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Greška pri dohvaćanju detalja izbora.';

      (Toast as any).show({ type: 'error', text1: msg });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ElectionStatus) => {
    if (!election) return;

    const statusValue =
      typeof newStatus === 'number'
        ? newStatus
        : STATUS_TO_INT[newStatus.toString().toUpperCase()] ?? newStatus;

    try {
      const updatedElection = await updateElectionStatus(election.id, {
        electionStatus: statusValue,
      } as any);

      setElection(updatedElection);
      (Toast as any).show({
        type: 'success',
        text1: 'Status izbora uspješno ažuriran!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Greška pri promjeni statusa izbora.';

      (Toast as any).show({ type: 'error', text1: msg });
      throw err;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error || !election) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'Izbori nisu pronađeni.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchElectionDetails}>
          <Text style={styles.retryText}>Pokušaj ponovno</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isActive =
    election.status === ElectionStatus.ACTIVE ||
    election.status?.toString().toUpperCase() === 'ACTIVE';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <StatusBadge status={election.status} />

            {isAdmin && (
              <TouchableOpacity
                style={styles.changeStatusButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.changeStatusText}>Promijeni status</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>{election.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Početak:</Text>
            <Text style={styles.infoValue}>{formatDate(election.startTime)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kraj:</Text>
            <Text style={styles.infoValue}>{formatDate(election.endTime)}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Kandidati</Text>

        {election.candidates && election.candidates.length > 0 ? (
          election.candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              selectable={false}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nema registriranih kandidata.</Text>
        )}

        {!isAdmin && (
          isActive ? (
            <Button
              title="Pristupi glasanju"
              onPress={() =>
                navigation.navigate('VoteScreen', {
                  electionId: election.id,
                  electionTitle: election.title,
                })
              }
              style={styles.voteButton}
            />
          ) : (
            <View style={styles.disabledVoteNotice}>
              <Text style={styles.disabledVoteText}>
                {election.status === ElectionStatus.PREPARATION
                  ? 'Izbori su u fazi pripreme. Glasanje još nije otvoreno.'
                  : 'Izbori su završeni. Glasanje više nije moguće.'}
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {isAdmin && (
        <UpdateStatusModal
          visible={isModalVisible}
          currentStatus={election.status ?? ElectionStatus.PREPARATION}
          onClose={() => setIsModalVisible(false)}
          onConfirm={handleStatusUpdate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  scrollContent: { padding: 16 },
  headerCard: { marginBottom: 20 },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  changeStatusButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 14, color: '#64748B' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  voteButton: { marginTop: 20 },
  disabledVoteNotice: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  disabledVoteText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});