import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import { Button, Card } from '../components/UI';
import { FAMILIES, FamilyId, LANGUAGES } from '../data/content';
import { useNavigation } from '../navigation';
import { useAppDispatch } from '../state/store';
import { spacing, Theme } from '../theme';

export default function FamilyScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const [family, setFamily] = useState<FamilyId | null>(null);

  const pickLanguage = (languageId: string) => {
    if (!family) return;
    dispatch({ type: 'SET_FAMILY', family });
    dispatch({ type: 'SET_LANGUAGE', languageId });
    go({ name: 'ladder' });
  };

  if (!family) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          ¿Qué familia de lenguas deseas aprender?
        </Text>

        <Card
          theme={theme}
          style={{ ...styles.familyCard, backgroundColor: '#E4F2E7' }}
          onPress={() => setFamily('amazonia')}
        >
          <Mascot kind="yaku" size={84} bounce={false} />
          <View style={styles.familyText}>
            <Text style={[styles.familyName, { color: theme.jungleDeep }]}>Amazonía</Text>
            <Text style={{ color: theme.jungle, fontSize: 15 }}>Lenguas amazónicas</Text>
            <Text style={{ fontSize: 20, marginTop: 4 }}>🌿🏞️🦜</Text>
          </View>
        </Card>

        <Card
          theme={theme}
          style={{ ...styles.familyCard, backgroundColor: '#F4E9E2' }}
          onPress={() => setFamily('andes')}
        >
          <Mascot kind="condor" size={84} bounce={false} />
          <View style={styles.familyText}>
            <Text style={[styles.familyName, { color: theme.andes }]}>Andes</Text>
            <Text style={{ color: theme.earth, fontSize: 15 }}>Lenguas andinas</Text>
            <Text style={{ fontSize: 20, marginTop: 4 }}>⛰️🧶☀️</Text>
          </View>
        </Card>
      </View>
    );
  }

  const familyDef = FAMILIES.find((f) => f.id === family)!;
  const languages = LANGUAGES.filter((l) => l.family === family).sort(
    (a, b) => Number(b.available) - Number(a.available)
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Mascot kind={familyDef.mascot} size={72} mood="celebrating" />
        <Text style={[styles.greeting, { color: theme.text }]}>
          {family === 'amazonia'
            ? '¡Excelente! Vamos a aprender juntos.'
            : '¡Qué buena elección!'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {languages.map((lang) => (
          <Card
            key={lang.id}
            theme={theme}
            style={{
              marginBottom: spacing.sm,
              opacity: lang.available ? 1 : 0.55,
              borderWidth: lang.featured ? 2 : 1,
              borderColor: lang.featured ? theme.gold : theme.border,
            }}
            onPress={lang.available ? () => pickLanguage(lang.id) : undefined}
          >
            <View style={styles.langRow}>
              <Text style={{ fontSize: 17, fontWeight: lang.featured ? '800' : '500', color: theme.text }}>
                {lang.featured ? '⭐ ' : ''}
                {lang.name}
              </Text>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>
                {lang.available ? 'Disponible' : 'Próximamente'}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Button title="← Cambiar familia" theme={theme} variant="ghost" onPress={() => setFamily(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  familyText: {
    flex: 1,
  },
  familyName: {
    fontSize: 24,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
