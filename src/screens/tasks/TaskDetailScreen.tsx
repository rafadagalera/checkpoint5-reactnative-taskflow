import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { StatusBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { formatDate } from '../../utils/formatDate';
import { TaskStackParamList } from '../../types/navigation';
import { TaskPriority } from '../../types/task';

type DetailRoute = RouteProp<TaskStackParamList, 'TaskDetail'>;
type DetailNav = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;

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

export function TaskDetailScreen() {
  const { theme } = useTheme();
  const { getTask, deleteTask } = useTasks();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();

  const task = getTask(route.params.taskId);

  if (!task) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Tarefa não encontrada.</Text>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert('Excluir Tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task!.id);
          navigation.goBack();
        },
      },
    ]);
  }

  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <ScrollView style={[styles.flex, { backgroundColor: theme.background }]} contentContainerStyle={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>{task.categoryIcon}</Text>
          <Text style={[styles.category, { color: theme.subtext }]}>{task.category}</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>

        {task.description ? (
          <Text style={[styles.description, { color: theme.subtext }]}>{task.description}</Text>
        ) : null}

        <View style={styles.badgesRow}>
          <StatusBadge status={task.status} />
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '22', borderColor: priorityColor }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <InfoRow label="Criado em" value={formatDate(task.createdAt)} theme={theme} />
        <InfoRow label="Atualizado em" value={formatDate(task.updatedAt)} theme={theme} />
      </View>

      <CustomButton
        title="Editar Tarefa"
        onPress={() => navigation.navigate('TaskForm', { taskId: task!.id })}
        style={styles.btn}
      />
      <CustomButton
        title="Excluir Tarefa"
        onPress={handleDelete}
        variant="danger"
        style={styles.btn}
      />
    </ScrollView>
  );
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.subtext }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 14, borderWidth: 1, padding: 18, marginBottom: 12 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  categoryIcon: { fontSize: 24 },
  category: { fontSize: 14 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 14 },
  badgesRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  priorityBadge: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '500' },
  btn: { marginBottom: 10 },
});
