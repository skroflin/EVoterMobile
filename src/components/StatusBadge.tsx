import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ElectionStatus } from '../types/election.types';

interface Props {
  status?: ElectionStatus;
}

export default function StatusBadge({ status }: Props) {
  const getBadgeConfig = () => {
    switch (status) {
      case ElectionStatus.ACTIVE:
        return { bg: '#E0F2FE', text: '#0284C7', label: 'Aktivno' };
      case ElectionStatus.PREPARATION:
        return { bg: '#FEF3C7', text: '#D97706', label: 'U pripremi' };
      case ElectionStatus.CLOSED:
        return { bg: '#F1F5F9', text: '#64748B', label: 'Završeno' };
      default:
        return { bg: '#F3F4F6', text: '#9CA3AF', label: 'Nepoznato' };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});