import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';
import { TaskStackParamList } from '../../types/navigation';
import { TaskStatus } from '../../types/task';

type TaskListNav = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

export function TaskListScreen() {
  const { theme } = useTheme();
  const { filteredTasks, isLoading, filter, setFilter } = useTasks();
  const navigation = useNavigation<TaskListNav>();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <Header />
      <FilterBar
        active={filter}
        onChange={(v) => setFilter(v as TaskStatus | 'todas')}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={
          isLoading ? null : (
            <EmptyState
              icon="📝"
              title="Nenhuma tarefa encontrada"
              subtitle="Toque no botão + para criar sua primeira tarefa"
            />
          )
        }
        contentContainerStyle={filteredTasks.length === 0 ? styles.empty : styles.list}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskForm', {})}
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingTop: 8, paddingBottom: 100 },
  empty: { flexGrow: 1 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
