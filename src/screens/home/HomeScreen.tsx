import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Header } from '../../components/Header';
import { fetchMotivationalQuote, MotivationalQuote } from '../../services/api';
import { TabParamList } from '../../types/navigation';

type HomeNav = BottomTabNavigationProp<TabParamList, 'Home'>;

export function HomeScreen() {
  const { theme } = useTheme();
  const { user, treatment } = useAuth();
  const { tasks } = useTasks();
  const navigation = useNavigation<HomeNav>();

  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState('');

  useEffect(() => {
    fetchMotivationalQuote()
      .then(setQuote)
      .catch(() => setQuoteError('Não foi possível carregar a frase.'))
      .finally(() => setQuoteLoading(false));
  }, []);

  const pending = tasks.filter(t => t.status === 'pendente').length;
  const inProgress = tasks.filter(t => t.status === 'em_andamento').length;
  const done = tasks.filter(t => t.status === 'concluida').length;

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.welcome, { color: theme.text }]}>
          Bem-vindo, {treatment} {user?.name}! 👋
        </Text>

        <View style={[styles.quoteCard, { backgroundColor: theme.primary + '18', borderColor: theme.primary }]}>
          <Text style={[styles.quoteTitle, { color: theme.primary }]}>💡 Frase do Dia</Text>
          {quoteLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : quoteError ? (
            <Text style={[styles.quoteError, { color: theme.error }]}>{quoteError}</Text>
          ) : (
            <>
              <Text style={[styles.quoteText, { color: theme.text }]}>"{quote?.text}"</Text>
              <Text style={[styles.quoteAuthor, { color: theme.subtext }]}>— {quote?.author}</Text>
            </>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Resumo</Text>
        <View style={styles.statsRow}>
          <StatCard label="Pendentes" value={pending} color={theme.subtext} theme={theme} />
          <StatCard label="Andamento" value={inProgress} color={theme.warning} theme={theme} />
          <StatCard label="Concluídas" value={done} color={theme.success} theme={theme} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Tasks')}
          style={[styles.ctaBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaText, { color: theme.primaryText }]}>Ver Minhas Tarefas →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color, theme }: { label: string; value: number; color: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subtext }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20 },
  welcome: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  quoteCard: { borderRadius: 14, borderWidth: 1, padding: 18, marginBottom: 24 },
  quoteTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  quoteText: { fontSize: 15, fontStyle: 'italic', lineHeight: 22 },
  quoteAuthor: { fontSize: 12, marginTop: 8, textAlign: 'right' },
  quoteError: { fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  ctaBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  ctaText: { fontSize: 15, fontWeight: '700' },
});
