import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Preencha usuário e senha.');
      return;
    }
    setLoading(true);
    setError('');
    const role = await login(username.trim(), password);
    setLoading(false);
    if (!role) {
      setError('Usuário ou senha inválidos.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>✅</Text>
        <Text style={[styles.title, { color: theme.text }]}>TaskFlow</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Gerencie suas tarefas com facilidade</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <CustomInput
            label="Usuário"
            value={username}
            onChangeText={text => { setUsername(text); setError(''); }}
            placeholder="Digite seu usuário"
            autoCapitalize="none"
          />
          <CustomInput
            label="Senha"
            value={password}
            onChangeText={text => { setPassword(text); setError(''); }}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: theme.error + '18', borderColor: theme.error }]}>
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            </View>
          ) : null}

          <CustomButton title="Entrar" onPress={handleLogin} loading={loading} style={styles.button} />
        </View>

        <Text style={[styles.hint, { color: theme.subtext }]}>admin / 123  •  user / 123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  card: { borderRadius: 16, borderWidth: 1, padding: 20 },
  errorBox: { borderRadius: 8, borderWidth: 1, padding: 12, marginBottom: 12 },
  errorText: { fontSize: 13, textAlign: 'center' },
  button: { marginTop: 4 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 24 },
});
