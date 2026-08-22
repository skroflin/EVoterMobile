import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { ElectionFilter as FilterType } from "../types/filters/ElectionFilter";

interface Props {
  filter: FilterType;
  onChange: (updatedFilter: FilterType) => void;
  onReset: () => void;
}

export default function ElectionFilter({ filter, onChange, onReset }: Props) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleFieldChange = (field: keyof FilterType, value: any) => {
    onChange({
      ...filter,
      [field]: value,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleStartDateChange = (
    event: DateTimePickerChangeEvent,
    selectedDate?: Date
  ) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleFieldChange("startDate", formatDate(selectedDate));
    }
  };

  const handleEndDateChange = (
    event: DateTimePickerChangeEvent,
    selectedDate?: Date
  ) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleFieldChange("endDate", formatDate(selectedDate));
    }
  };

  const hasActiveFilters =
    Boolean(filter.title) ||
    Boolean(filter.candidateName) ||
    Boolean(filter.startDate) ||
    Boolean(filter.endDate);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Election filter</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Election name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter election name..."
          placeholderTextColor="#94A3B8"
          value={filter.title || ""}
          onChangeText={(text) => handleFieldChange("title", text)}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Candidate name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter candidate name..."
          placeholderTextColor="#94A3B8"
          value={filter.candidateName || ""}
          onChangeText={(text) => handleFieldChange("candidateName", text)}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.dateRow}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Date from</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !filter.startDate && styles.placeholderText,
              ]}
            >
              {filter.startDate || "Choose start date"}
            </Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={
                filter.startDate ? new Date(filter.startDate) : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleStartDateChange}
            />
          )}
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Date to</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !filter.endDate && styles.placeholderText,
              ]}
            >
              {filter.endDate || "Choose end date"}
            </Text>
          </TouchableOpacity>

          {showEndDatePicker && (
            <DateTimePicker
              value={filter.endDate ? new Date(filter.endDate) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleEndDateChange}
            />
          )}
        </View>
      </View>

      {hasActiveFilters && (
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetText}>Clear filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    fontSize: 14,
    color: "#0F172A",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateSelector: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  resetButton: {
    marginTop: 4,
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
});