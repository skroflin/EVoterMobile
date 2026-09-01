import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ElectionFilterComponent from '../../components/ElectionFilter';
import { getAllElections } from '../../api/api';
import { ElectionResponse } from '../../types/election.types';
import { ElectionFilter } from '../../types/filters/ElectionFilter';
import { MainStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const INITIAL_FILTER: ElectionFilter = {
  title: '',
  candidateName: '',
  startDate: '',
  endDate: '',
};

const PAGE_SIZE = 20;

export default function ElectionListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [elections, setElections] = useState<ElectionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [filter, setFilter] = useState<ElectionFilter>(INITIAL_FILTER);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const fetchInitialElections = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await getAllElections(filter, 0, PAGE_SIZE, 'createdAt,desc');
        const content = response.content || [];

        setElections(content);
        setPage(0);
        setHasMore(!response.last && content.length === PAGE_SIZE);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === 'string' ? err.response.data : null) ||
          'Greška pri dohvaćanju popisa izbora.';

        (Toast as any).show({
          type: 'error',
          text1: msg,
        });
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filter]
  );

  useFocusEffect(
    useCallback(() => {
      fetchInitialElections();
    }, [fetchInitialElections])
  );

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || loading || refreshing) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getAllElections(filter, nextPage, PAGE_SIZE, 'createdAt,desc');
      const newContent = response.content || [];

      setElections((prev) => [...prev, ...newContent]);
      setPage(nextPage);
      setHasMore(!response.last && newContent.length === PAGE_SIZE);
    } catch (err: any) {
      console.error('Greška pri učitavanju dodatnih izbora:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Izbori</Text>
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={() => setShowFilter((prev) => !prev)}
        >
          <Text style={styles.filterToggleText}>
            {showFilter ? 'Sakrij filtere' : 'Filteri'}
          </Text>
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.filterContainer}>
          <ElectionFilterComponent
            filter={filter}
            onChange={setFilter}
            onReset={() => setFilter(INITIAL_FILTER)}
          />
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchInitialElections()}
          >
            <Text style={styles.retryText}>Pokušaj ponovno</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={elections}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchInitialElections(true)}
              colors={['#2563EB']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() =>
                navigation.navigate('ElectionDetails', { electionId: item.id })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.electionTitle}>{item.title}</Text>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.datesContainer}>
                <Text style={styles.dateText}>
                  Trajanje: {formatDate(item.startTime)} — {formatDate(item.endTime)}
                </Text>
              </View>

              <Text style={styles.candidateCount}>
                Broj kandidata: {item.candidates?.length ?? 0}
              </Text>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nema pronađenih izbora.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  filterToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  filterToggleText: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listContent: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: { marginBottom: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  electionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  datesContainer: { marginBottom: 6 },
  dateText: { fontSize: 13, color: '#64748B' },
  candidateCount: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
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
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#94A3B8' },
  footerLoader: { paddingVertical: 16, alignItems: 'center' },
});