import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { TaskFormScreen } from '../screens/tasks/TaskFormScreen';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';
import { TaskStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export function TaskStackRoutes() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.primary,
        headerTitleStyle: { color: theme.text, fontWeight: '700' },
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={({ route }) => ({
        title: (route.params as { taskId?: string })?.taskId ? 'Editar Tarefa' : 'Nova Tarefa',
      })} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalhe da Tarefa' }} />
    </Stack.Navigator>
  );
}
