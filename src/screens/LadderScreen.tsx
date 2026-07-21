import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import { cultureForLevel, getLanguage, TOTAL_LEVELS } from '../data/content';
import { useNavigation } from '../navigation';
import { useAppState } from '../state/store';
import { radius, spacing, Theme } from '../theme';

const STEP_HEIGHT = 92;

// La Escalera del Conocimiento: ruta vertical ascendente (nivel 1 abajo,
// nivel 20 en la cima), a diferencia de la ruta horizontal tipo Duolingo.
export default function LadderScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const state = useAppState();
  const scrollRef = useRef<ScrollView>(null);

  const lang = state.languageId ? getLanguage(state.languageId) : undefined;
  const progress = state.languageId ? state.progress[state.languageId] : undefined;
  const currentLevel = progress?.level ?? 1;

  const isAmazonia = state.family !== 'andes';
  const mascot = isAmazonia ? 'yaku' : 'condor';

  useEffect(() => {
    // Centrar el nivel actual: la lista va de arriba (20) hacia abajo (1).
    const fromTop = (TOTAL_LEVELS - currentLevel) * STEP_HEIGHT;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, fromTop - 200), animated: false });
    }, 50);
  }, [currentLevel]);

  if (!lang) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Elige primero una lengua.</Text>
      </View>
    );
  }

  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => TOTAL_LEVELS - i);

  return (
    <View style={[{ flex: 1 }, { backgroundColor: isAmazonia ? '#DFEEDD' : '#E8E4F0' }]}>
      {/* Encabezado con estadísticas */}
      <View style={[styles.statsBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.stat, { color: theme.text }]}>🔥 {state.streak}</Text>
        <Text style={[styles.stat, { color: theme.text }]}>⭐ {state.xp} XP</Text>
        <Text style={[styles.stat, { color: theme.text }]} numberOfLines={1}>
          {lang.name}
        </Text>
        <Pressable onPress={() => go({ name: 'saludo' })} hitSlop={8}>
          <Text style={styles.stat}>👋</Text>
        </Pressable>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
        {/* Cima */}
        <View style={styles.summit}>
          <Text style={{ fontSize: 40 }}>⭐</Text>
          <Text style={[styles.summitText, { color: theme.textMuted }]}>
            La cima del conocimiento ancestral
          </Text>
        </View>

        {levels.map((level) => {
          const unlocked = level <= currentLevel;
          const completed = level < currentLevel;
          const isCurrent = level === currentLevel;
          const culture = cultureForLevel(lang, level);
          // Zigzag suave para dar sensación de escalera.
          const offset = level % 2 === 0 ? 40 : -40;

          return (
            <View key={level} style={[styles.stepRow, { transform: [{ translateX: offset }] }]}>
              <Pressable
                disabled={!unlocked}
                onPress={() => go({ name: 'lesson', level })}
                style={[
                  styles.step,
                  {
                    backgroundColor: completed
                      ? theme.jungle
                      : isCurrent
                      ? theme.primary
                      : theme.locked,
                    borderColor: isCurrent ? theme.gold : 'transparent',
                    borderWidth: isCurrent ? 3 : 0,
                  },
                ]}
              >
                <Text style={styles.stepLevel}>
                  {completed ? '✓' : unlocked ? level : '🔒'}
                </Text>
                <Text style={styles.stepLabel}>
                  {culture ? '📚 Nivel cultural' : `Nivel ${level}`}
                </Text>
              </Pressable>
              {isCurrent && (
                <View style={styles.mascotOnStep}>
                  <Mascot kind={mascot} size={54} />
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.base}>
          <Text style={[styles.summitText, { color: theme.textMuted }]}>
            Comienza aquí tu ascenso 🌱
          </Text>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.tab, { color: theme.primary }]}>🪜 Ruta</Text>
        <Pressable onPress={() => go({ name: 'profile' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>👤 Perfil</Text>
        </Pressable>
        <Pressable onPress={() => go({ name: 'settings' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>⚙️ Ajustes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 1.4,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  stat: { fontSize: 16, fontWeight: '700', flexShrink: 1 },
  scroll: { alignItems: 'center', paddingVertical: spacing.xl },
  summit: { alignItems: 'center', marginBottom: spacing.lg },
  summitText: { fontSize: 13, marginTop: 4 },
  stepRow: {
    height: STEP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    width: 170,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  stepLevel: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  stepLabel: { fontSize: 12, color: '#FFFFFFDD', marginTop: 2 },
  mascotOnStep: {
    position: 'absolute',
    right: -40,
    top: 0,
  },
  base: { alignItems: 'center', marginTop: spacing.md },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  tab: { fontSize: 15, fontWeight: '700' },
});
