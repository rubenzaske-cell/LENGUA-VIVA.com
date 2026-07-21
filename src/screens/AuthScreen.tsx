import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card } from '../components/UI';
import { useNavigation } from '../navigation';
import { useAppDispatch } from '../state/store';
import { spacing, Theme } from '../theme';

// Prototipo: los botones de Google/Apple simulan la autenticación.
// La integración OAuth real se conectará en una fase posterior.

export default function AuthScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [emailMode, setEmailMode] = useState(false);

  const signIn = (method: 'google' | 'apple' | 'email' | 'guest') => {
    dispatch({
      type: 'SIGN_IN',
      method,
      name: name.trim() || (method === 'guest' ? 'Invitado' : 'Explorador'),
    });
    go({ name: 'onboarding' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Crea tu cuenta</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Guarda tu progreso y sube por la Escalera del Conocimiento.
      </Text>

      <Card theme={theme} style={styles.card}>
        <Button title="🔵  Continuar con Google" theme={theme} variant="secondary" onPress={() => signIn('google')} />
        <View style={styles.gap} />
        <Button title="  Continuar con Apple" theme={theme} variant="secondary" onPress={() => signIn('apple')} />
        <View style={styles.gap} />
        {emailMode ? (
          <>
            <TextInput
              placeholder="Tu nombre"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt },
              ]}
            />
            <View style={styles.gap} />
            <Button title="Crear cuenta" theme={theme} onPress={() => signIn('email')} />
          </>
        ) : (
          <Button title="✉️  Continuar con correo" theme={theme} onPress={() => setEmailMode(true)} />
        )}
        <View style={styles.gap} />
        <Button title="👤  Continuar como invitado" theme={theme} variant="ghost" onPress={() => signIn('guest')} />
      </Card>

      <Text style={[styles.note, { color: theme.textMuted }]}>
        Como invitado, tu progreso solo se guarda en este dispositivo. Al continuar
        aceptas nuestros Términos y Política de privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  gap: {
    height: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 340,
    alignSelf: 'center',
  },
});
