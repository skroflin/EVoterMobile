import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ElectionStatus } from '../types/election.types';

interface UpdateStatusModalProps {
  visible: boolean;
  currentStatus?: ElectionStatus;
  onClose: () => void;
  onConfirm: (newStatus: ElectionStatus) => Promise<void>;
}

const STATUS_OPTIONS: { label: string; value: ElectionStatus; description: string }[] = [
  {
    label: 'U pripremi',
    value: ElectionStatus.PREPARATION,
    description: 'Izbori nisu otvoreni. Glasanje je onemogućeno.',
  },
  {
    label: 'Aktivno',
    value: ElectionStatus.ACTIVE,
    description: 'Izbori su u tijeku. Korisnici mogu glasati.',
  },
  {
    label: 'Završeno',
    value: ElectionStatus.CLOSED,
    description: 'Izbori su zatvoreni. Glasanje više nije moguće.',
  },
];

export default function UpdateStatusModal({
  visible,
  currentStatus = ElectionStatus.PREPARATION,
  onClose,
  onConfirm,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ElectionStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, visible]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onConfirm(selectedStatus);
      onClose();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Ažuriraj status izbora</Text>
          <Text style={styles.subtitle}>Odaberite novi status za ove izbore:</Text>

          <View style={styles.optionsContainer}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => setSelectedStatus(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioRow}>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Odustani</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveText}>Spremi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  optionCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  optionLabelSelected: {
    color: '#1E40AF',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 28,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});