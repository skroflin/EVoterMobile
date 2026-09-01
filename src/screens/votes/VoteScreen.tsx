import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import Card from '../../components/Card';
import { castVote, generateVotingToken } from '../../api/api';
import { VoteRequest } from '../../types/vote.types';

export interface Candidate {
  id: string;
  name: string;
  party?: string;
  description?: string;
}

export interface Election {
  id: string | number;
  title: string;
  description?: string;
  candidates: Candidate[];
  hasVoted?: boolean;
  userVoted?: boolean;
  status?: string | number;
}

export default function VoteScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const election: Election = route.params?.election;

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [votingToken, setVotingToken] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!election) return;

    const hasVoted = Boolean(election.hasVoted || election.userVoted);
    const isActive =
      election.status === 'ACTIVE' ||
      election.status === 1 ||
      election.status?.toString().toUpperCase() === 'ACTIVE';

    if (hasVoted) {
      (Toast as any).show({
        type: 'error',
        text1: 'Već ste glasali na ovim izborima!',
      });
      navigation.goBack();
      return;
    }

    if (!isActive && election.status !== undefined) {
      (Toast as any).show({
        type: 'error',
        text1: 'Glasanje za ove izbore trenutno nije aktivno.',
      });
      navigation.goBack();
      return;
    }

    // 2. Generiranje glasačkog tokena
    const fetchToken = async () => {
      try {
        setIsFetchingToken(true);
        setError(null);

        const response = await generateVotingToken(election.id.toString());
        const tokenValue = typeof response === 'string' ? response : (response as any)?.token;
        setVotingToken(tokenValue);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === 'string' ? err.response.data : null) ||
          'Greška pri generiranju glasačkog tokena. Pokušajte ponovno.';

        (Toast as any).show({
          type: 'error',
          text1: msg,
        });
        setError(msg);
      } finally {
        setIsFetchingToken(false);
      }
    };

    fetchToken();
  }, [election, navigation]);

  if (!election) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Podaci o izborima nisu pronađeni.</Text>
      </SafeAreaView>
    );
  }

  const handleSelectCandidate = (id: string) => {
    if (error || !votingToken || isFetchingToken) return;
    setSelectedCandidateId(id);
    setError(null);
  };

  const handleVoteSubmit = () => {
    if (!selectedCandidateId || !votingToken) return;

    const selectedCandidate = election.candidates.find(
      (c) => c.id === selectedCandidateId
    );

    Alert.alert(
      'Potvrda glasanja',
      `Jeste li sigurni da želite glasati za: "${selectedCandidate?.name}"? Ova radnja je konačna.`,
      [
        { text: 'Odustani', style: 'cancel' },
        {
          text: 'Potvrdi i glasaj',
          style: 'default',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              setError(null);

              const requestData: VoteRequest = {
                candidateUUID: selectedCandidateId,
                token: votingToken,
              };

              await castVote(election.id.toString(), requestData);

              (Toast as any).show({
                type: 'success',
                text1: 'Glasanje uspješno!',
                text2: 'Vaš glas je uspješno zabilježen.',
              });

              navigation.goBack();
            } catch (err: any) {
              const msg =
                err?.response?.data?.message ||
                (typeof err?.response?.data === 'string' ? err.response.data : null) ||
                'Došlo je do pogreške prilikom slanja glasa. Pokušajte ponovno.';

              (Toast as any).show({
                type: 'error',
                text1: msg,
              });
              setError(msg);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const renderCandidateItem = ({ item }: { item: Candidate }) => {
    const isSelected = item.id === selectedCandidateId;
    const isDisabled = Boolean(error) || !votingToken || isFetchingToken;

    return (
      <Card
        style={[
          styles.candidateCard,
          isSelected && styles.candidateCardSelected,
          isDisabled && styles.candidateCardDisabled,
        ]}
        onPress={() => handleSelectCandidate(item.id)}
      >
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radioButton,
              isSelected && styles.radioButtonSelected,
              isDisabled && styles.radioButtonDisabled,
            ]}
          >
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        </View>

        <View style={styles.candidateInfo}>
          <Text style={[styles.candidateName, isDisabled && styles.disabledText]}>
            {item.name}
          </Text>
          {item.party ? (
            <Text style={[styles.candidateParty, isDisabled && styles.disabledText]}>
              {item.party}
            </Text>
          ) : null}
          {item.description ? (
            <Text style={styles.candidateDescription}>{item.description}</Text>
          ) : null}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{election.title}</Text>
        {election.description ? (
          <Text style={styles.subtitle}>{election.description}</Text>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Odaberite kandidata:</Text>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isFetchingToken ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Generiranje glasačkog tokena...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={election.candidates}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCandidateItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.voteButton,
                (!selectedCandidateId || isSubmitting || !votingToken) &&
                styles.voteButtonDisabled,
              ]}
              onPress={handleVoteSubmit}
              disabled={!selectedCandidateId || isSubmitting || !votingToken}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.voteButtonText}>Potvrdi glas</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  candidateCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioContainer: {
    marginRight: 14,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2563EB',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  candidateParty: {
    fontSize: 13,
    color: '#2563EB',
    marginTop: 2,
    fontWeight: '500',
  },
  candidateDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  voteButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  voteButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  candidateCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9',
  },
  radioButtonDisabled: {
    borderColor: '#CBD5E1',
  },
  disabledText: {
    color: '#94A3B8',
  },
});