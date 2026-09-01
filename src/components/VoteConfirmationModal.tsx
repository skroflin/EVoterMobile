import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    Platform,
} from 'react-native';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { CheckCircle2, Copy, Share2, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import Card from './Card';
import Button from './Button';

interface VoteConfirmationModalProps {
    visible: boolean;
    electionTitle: string;
    verificationCode: string;
    votedAt?: string;
    onClose: () => void;
}

export default function VoteConfirmationModal({
    visible,
    electionTitle,
    verificationCode,
    votedAt,
    onClose,
}: VoteConfirmationModalProps) {
    const [copied, setCopied] = useState(false);
    const [, setString] = useClipboard();

    const formattedDate = votedAt
        ? new Date(votedAt).toLocaleString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : new Date().toLocaleString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const handleCopyCode = () => {
        setString(verificationCode);
        setCopied(true);
        Toast.show({
            type: 'success',
            text1: 'Kôd je kopiran u međuspremnik!',
        });

        setTimeout(() => setCopied(false), 3000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Potvrda glasanja za "${electionTitle}". Verifikacijski kôd: ${verificationCode}`,
            });
        } catch (error) {
            console.error('Greška pri dijeljenju:', error);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <CheckCircle2 size={56} color="#16A34A" />
                        </View>
                        <Text style={styles.title}>Glasanje uspješno!</Text>
                        <Text style={styles.subtitle}>
                            Vaš je glas kriptiran i zaprimljen u sustav.
                        </Text>
                    </View>

                    <Card style={styles.codeCard}>
                        <View style={styles.codeHeader}>
                            <ShieldCheck size={18} color="#2563EB" />
                            <Text style={styles.codeLabel}>Verifikacijski kôd glasa</Text>
                        </View>

                        <Text style={styles.codeText} selectable>
                            {verificationCode}
                        </Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleCopyCode}
                                activeOpacity={0.7}
                            >
                                <Copy size={16} color="#2563EB" />
                                <Text style={styles.iconButtonText}>
                                    {copied ? 'Kopirano!' : 'Kopiraj kôd'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleShare}
                                activeOpacity={0.7}
                            >
                                <Share2 size={16} color="#2563EB" />
                                <Text style={styles.iconButtonText}>Podijeli</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            <Text style={styles.boldText}>Izbori: </Text>
                            {electionTitle}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.boldText}>Vrijeme: </Text>
                            {formattedDate}
                        </Text>
                    </View>

                    <Text style={styles.noticeText}>
                        Pohranite ovaj kôd kako biste naknadno mogli provjeriti status svog glasa u matematički verifikabilnom zapisniku.
                    </Text>

                    <Button
                        title="Povratak na početnu"
                        onPress={onClose}
                        style={styles.closeButton}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        backgroundColor: '#DCFCE7',
        padding: 12,
        borderRadius: 50,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
    codeCard: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 14,
        marginBottom: 16,
    },
    codeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    codeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    codeText: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 13,
        color: '#0F172A',
        backgroundColor: '#F1F5F9',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        textAlign: 'center',
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 8,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    iconButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 13,
        color: '#1E40AF',
        marginBottom: 2,
    },
    boldText: {
        fontWeight: '600',
    },
    noticeText: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 20,
    },
    closeButton: {
        width: '100%',
    },
});