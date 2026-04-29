import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { theme } = useTheme();
  const { user, treatment, logout } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <View>
        <Text style={[styles.greeting, { color: theme.subtext }]}>Olá, {treatment}</Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: user?.role === 'admin' ? theme.primary : theme.success }]}>
          <Text style={styles.badgeText}>{user?.role === 'admin' ? 'Admin' : 'User'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { borderColor: theme.error }]}>
          <Text style={[styles.logoutText, { color: theme.error }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 12 },
  name: { fontSize: 17, fontWeight: '700' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  logoutBtn: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  logoutText: { fontSize: 12, fontWeight: '600' },
});
