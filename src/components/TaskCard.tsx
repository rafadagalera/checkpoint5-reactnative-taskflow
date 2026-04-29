import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskPriority } from '../types/task';
import { useTheme } from '../hooks/useTheme';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatDate';

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  baixa: '#10B981',
  media: '#F59E0B',
  alta: '#EF4444',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
  const { theme } = useTheme();
  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      activeOpacity={0.75}
    >
      <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.categoryIcon]}>{task.categoryIcon}</Text>
          <Text style={[styles.category, { color: theme.subtext }]}>{task.category}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '22' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{task.title}</Text>
        {task.description ? (
          <Text style={[styles.desc, { color: theme.subtext }]} numberOfLines={1}>{task.description}</Text>
        ) : null}
        <View style={styles.footer}>
          <StatusBadge status={task.status} />
          <Text style={[styles.date, { color: theme.subtext }]}>{formatDate(task.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  priorityBar: { width: 4 },
  content: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  categoryIcon: { fontSize: 16 },
  category: { fontSize: 12, flex: 1 },
  priorityBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 13, marginBottom: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  date: { fontSize: 11 },
});
