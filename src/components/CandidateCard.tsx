import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { CandidateResponse } from '../types/election.types';

interface CandidateCardProps {
  candidate: CandidateResponse;
  isSelected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
}

export default function CandidateCard({
  candidate,
  isSelected = false,
  onSelect,
  selectable = true,
}: CandidateCardProps) {
  return (
    <Card
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={selectable && onSelect ? onSelect : undefined}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{candidate.name}</Text>
          {candidate.bio ? (
            <Text style={styles.description}>{candidate.bio}</Text>
          ) : null}
        </View>
        {selectable && (
          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
});