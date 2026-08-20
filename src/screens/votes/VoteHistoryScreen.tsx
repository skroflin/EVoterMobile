// src/screens/votes/VoteHistoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '../../components/Card';
import { getMyVoteHistory } from '../../api/api';
import { VoterVoteHistoryResponse } from '../../types/vote.types';

export default function VoteHistoryScreen() {
    const [votes, setVotes] = useState<VoterVoteHistoryResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const PAGE_SIZE = 10;

    const fetchHistory = useCallback(
        async (pageToFetch: number, isRefresh = false) => {
            try {
                if (isRefresh) {
                    setIsRefreshing(true);
                } else if (pageToFetch > 0) {
                    setIsLoadingMore(true);
                } else {
                    setIsLoading(true);
                }

                setError(null);

                const data = await getMyVoteHistory(pageToFetch, PAGE_SIZE, 'votedAt,desc');

                setVotes((prevVotes) =>
                    isRefresh ? data.content : [...prevVotes, ...data.content]
                );
                setPage(data.number);
                setTotalPages(data.totalPages);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    'Greška pri dohvaćanju povijesti glasanja.';
                setError(msg);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
                setIsLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchHistory(0);
    }, [fetchHistory]);

    const handleRefresh = () => {
        fetchHistory(0, true);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && page + 1 < totalPages) {
            fetchHistory(page + 1);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderVoteItem = ({ item }: { item: VoterVoteHistoryResponse }) => (
        <Card style={styles.voteCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.electionTitle} numberOfLines={2}>
                    {item.electionName}
                </Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Glasano</Text>
                </View>
            </View>

            <Text style={styles.dateText}>
                Vrijeme glasanja: {formatDate(item.votedAt)}
            </Text>
        </Card>
    );

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#2563EB" />
            </View>
        );
    };

    const renderEmptyState = () => {
        if (isLoading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Nema zabilježenih glasova</Text>
                <Text style={styles.emptySubtitle}>
                    Kada sudjelujete u izborima, vaši zabilježeni glasovi pojavit će se ovdje.
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.title}>Povijest glasanja</Text>
                <Text style={styles.subtitle}>
                    Pregled izbora na kojima ste glasali
                </Text>
            </View>

            {error && (
                <View style={styles.errorCard}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {isLoading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={votes}
                    keyExtractor={(item, index) =>
                        item.electionId ? `${item.electionId}-${index}` : `${item.votedAt}-${index}`
                    }
                    renderItem={renderVoteItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={['#2563EB']}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmptyState}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
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
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        flexGrow: 1,
    },
    voteCard: {
        marginBottom: 12,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    electionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: '#15803D',
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 13,
        color: '#64748B',
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: 'center',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
});