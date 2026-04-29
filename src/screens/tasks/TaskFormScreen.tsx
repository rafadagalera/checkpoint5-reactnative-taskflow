import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { fetchCategories, Category } from '../../services/api';
import { TaskStackParamList } from '../../types/navigation';
import { TaskStatus, TaskPriority } from '../../types/task';

type FormRoute = RouteProp<TaskStackParamList, 'TaskForm'>;
type FormNav = NativeStackNavigationProp<TaskStackParamList, 'TaskForm'>;

const STATUSES: { label: string; value: TaskStatus }[] = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em Andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

const PRIORITIES: { label: string; value: TaskPriority }[] = [
  { label: 'Baixa', value: 'baixa' },
  { label: 'Média', value: 'media' },
  { label: 'Alta', value: 'alta' },
];

export function TaskFormScreen() {
  const { theme } = useTheme();
  const { createTask, updateTask, getTask } = useTasks();
  const route = useRoute<FormRoute>();
  const navigation = useNavigation<FormNav>();

  const editingId = route.params?.taskId;
  const existing = editingId ? getTask(editingId) : undefined;
  const isEditing = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existing?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existing?.priority ?? 'media');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    existing ? { id: 0, name: existing.category, icon: existing.categoryIcon } : null
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState('');
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCatsError('Erro ao carregar categorias'))
      .finally(() => setCatsLoading(false));
  }, []);

  async function handleSave() {
    if (!title.trim()) {
      setTitleError('O título é obrigatório.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }
    setSaving(true);
    if (isEditing && editingId) {
      await updateTask(editingId, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
      });
    } else {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
      });
    }
    setSaving(false);
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <CustomInput
          label="Título *"
          value={title}
          onChangeText={t => { setTitle(t); setTitleError(''); }}
          placeholder="Ex: Estudar React Native"
          error={titleError}
        />
        <CustomInput
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva a tarefa (opcional)"
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Status</Text>
        <View style={styles.chips}>
          {STATUSES.map(s => (
            <TouchableOpacity
              key={s.value}
              onPress={() => setStatus(s.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: status === s.value ? theme.primary : theme.card,
                  borderColor: status === s.value ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: status === s.value ? theme.primaryText : theme.subtext, fontSize: 13, fontWeight: '500' }}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Prioridade</Text>
        <View style={styles.chips}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p.value}
              onPress={() => setPriority(p.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: priority === p.value ? theme.primary : theme.card,
                  borderColor: priority === p.value ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: priority === p.value ? theme.primaryText : theme.subtext, fontSize: 13, fontWeight: '500' }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Categoria</Text>
        {catsLoading ? (
          <ActivityIndicator color={theme.primary} style={{ marginVertical: 12 }} />
        ) : catsError ? (
          <Text style={[styles.errorText, { color: theme.error }]}>{catsError}</Text>
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map(c => {
              const isSelected = selectedCategory?.name === c.name;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedCategory(c)}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: isSelected ? theme.primary + '22' : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={styles.categoryIcon}>{c.icon}</Text>
                  <Text style={[styles.categoryName, { color: isSelected ? theme.primary : theme.text }]} numberOfLines={1}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <CustomButton
          title={isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '500', marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryItem: { borderRadius: 10, borderWidth: 1, padding: 10, alignItems: 'center', width: '30%' },
  categoryIcon: { fontSize: 22, marginBottom: 4 },
  categoryName: { fontSize: 11, textAlign: 'center' },
  errorText: { fontSize: 13, marginBottom: 12 },
  saveBtn: { marginTop: 8 },
});
