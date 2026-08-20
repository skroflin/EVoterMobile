import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import CandidateCard from '../../components/CandidateCard';
import Button from '../../components/Button';
import { getElectionById } from '../../api/api';
import { ElectionStatus, ElectionResponse } from '../../types/election.types';
import { MainStackParamList } from '../../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MainStackParamList, 'ElectionDetails'>;

export default function ElectionDetailsScreen({ route, navigation }: Props) {
  const { electionId } = route.params;
  const [election, setElection] = useState<ElectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(
        err?.response?.data?.message || 'Greška pri dohvaćanju detalja izbora.'
      );
    } finally {
      setLoading(false);
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
        <Text style={styles.emptyText}>
          {error || 'Izbori nisu pronađeni.'}
        </Text>
      </SafeAreaView>
    );
  }

  const isActive = election.status === ElectionStatus.ACTIVE;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <StatusBadge status={election.status} />
          </View>

          <Text style={styles.title}>{election.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Početak:</Text>
            <Text style={styles.infoValue}>{election.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kraj:</Text>
            <Text style={styles.infoValue}>{election.endDate}</Text>
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

        {isActive && (
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
        )}
      </ScrollView>
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
  badgeRow: { marginBottom: 10 },
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
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});