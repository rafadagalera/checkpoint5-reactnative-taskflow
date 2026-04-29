import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TaskStatus } from '../types/task';
import { useTheme } from '../hooks/useTheme';

type FilterOption = TaskStatus | 'todas';

const OPTIONS: { label: string; value: FilterOption }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em Andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

interface FilterBarProps {
  active: FilterOption;
  onChange: (value: FilterOption) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  const { theme } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.container}>
      {OPTIONS.map(opt => {
        const isActive = active === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? theme.primary : theme.card,
                borderColor: isActive ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: isActive ? theme.primaryText : theme.subtext }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 52 },
  container: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
});
