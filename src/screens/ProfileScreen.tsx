import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar } from '../components/UI';
import { getLanguage, TOTAL_LEVELS } from '../data/content';
import { useNavigation } from '../navigation';
import { useAppState } from '../state/store';
import { spacing, Theme } from '../theme';

export default function ProfileScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const state = useAppState();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl * 1.5 }}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={{ fontSize: 40 }}>🧑</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{state.userName ?? 'Explorador'}</Text>
          <Text style={{ color: theme.textMuted }}>
            {state.authMethod === 'guest' ? 'Cuenta de invitado' : 'Aprendiz de lenguas vivas'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Card theme={theme} style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.streak}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Racha</Text>
          </Card>
          <Card theme={theme} style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.xp}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>XP total</Text>
          </Card>
          <Card theme={theme} style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{state.minutesStudied}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Minutos</Text>
          </Card>
        </View>

        <Text style={[styles.section, { color: theme.text }]}>Mis lenguas</Text>
        {Object.entries(state.progress).map(([langId, prog]) => {
          const lang = getLanguage(langId);
          if (!lang) return null;
          const pct = Math.min(1, (prog.level - 1) / TOTAL_LEVELS);
          return (
            <Card key={langId} theme={theme} style={{ marginBottom: spacing.sm }}>
              <View style={styles.langRow}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>
                  {lang.family === 'amazonia' ? '🐬' : '🦅'} {lang.name}
                </Text>
                <Text style={{ color: theme.textMuted }}>{Math.round(pct * 100)}%</Text>
              </View>
              <View style={{ marginTop: spacing.sm }}>
                <ProgressBar value={pct} theme={theme} />
              </View>
            </Card>
          );
        })}
        {Object.keys(state.progress).length === 0 && (
          <Text style={{ color: theme.textMuted }}>Aún no has empezado ninguna lengua.</Text>
        )}

        <Text style={[styles.section, { color: theme.text }]}>Insignias</Text>
        <View style={styles.badges}>
          {state.badges.length === 0 && (
            <Text style={{ color: theme.textMuted }}>
              Completa niveles para ganar insignias.
            </Text>
          )}
          {state.badges.map((b) => (
            <Card key={b.id} theme={theme} style={styles.badge}>
              <Text style={{ fontSize: 30 }}>{b.emoji}</Text>
              <Text style={{ fontSize: 12, color: theme.text, textAlign: 'center' }}>{b.name}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={() => go({ name: 'ladder' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>🪜 Ruta</Text>
        </Pressable>
        <Text style={[styles.tab, { color: theme.primary }]}>👤 Perfil</Text>
        <Pressable onPress={() => go({ name: 'settings' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>⚙️ Ajustes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: { fontSize: 24, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center' },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 12 },
  section: { fontSize: 18, fontWeight: '800', marginTop: spacing.md, marginBottom: spacing.sm },
  langRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: { width: 100, alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  tab: { fontSize: 15, fontWeight: '700' },
});
