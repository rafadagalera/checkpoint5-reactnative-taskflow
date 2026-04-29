import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/Header';
import { Treatment } from '../../types/user';

const TREATMENTS: Treatment[] = ['Sr.', 'Sra.', 'Srta.'];

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, treatment, setTreatment } = useAuth();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>

        <SectionTitle title="Aparência" theme={theme} />
        <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {theme.mode === 'dark' ? '🌙 Tema Escuro' : '☀️ Tema Claro'}
          </Text>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>

        <SectionTitle title="Preferências" theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.subtext }]}>Preferência de tratamento</Text>
          <View style={styles.chips}>
            {TREATMENTS.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setTreatment(t)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: treatment === t ? theme.primary : 'transparent',
                    borderColor: treatment === t ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text style={{ color: treatment === t ? theme.primaryText : theme.subtext, fontWeight: '600', fontSize: 14 }}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <SectionTitle title="Perfil" theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <InfoItem label="Nome" value={user?.name ?? '-'} theme={theme} />
          <InfoItem label="Usuário" value={user?.username ?? '-'} theme={theme} />
          <InfoItem label="Perfil" value={user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário'} theme={theme} />
        </View>

      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, theme }: { title: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{title.toUpperCase()}</Text>;
}

function InfoItem({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: theme.subtext }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 4 },
  rowLabel: { fontSize: 15, fontWeight: '500' },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 4 },
  cardLabel: { fontSize: 13, marginBottom: 10 },
  chips: { flexDirection: 'row', gap: 10 },
  chip: { borderRadius: 8, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 8 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600' },
});
