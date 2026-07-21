import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import { Button, Card, ProgressBar } from '../components/UI';
import { useNavigation } from '../navigation';
import { useAppDispatch, useAppState } from '../state/store';
import { radius, spacing, Theme } from '../theme';

interface Option {
  id: string;
  label: string;
}

interface Question {
  id: 'ageRange' | 'studiedBefore' | 'dailyGoal' | 'motivations';
  title: string;
  multi?: boolean;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'ageRange',
    title: '¿Cuántos años tienes?',
    options: [
      { id: '13-17', label: '13 – 17' },
      { id: '18-25', label: '18 – 25' },
      { id: '26-40', label: '26 – 40' },
      { id: '41-60', label: '41 – 60' },
      { id: '60+', label: 'Más de 60' },
    ],
  },
  {
    id: 'studiedBefore',
    title: '¿Has estudiado alguna lengua indígena?',
    options: [
      { id: 'si', label: 'Sí' },
      { id: 'no', label: 'No' },
      { id: 'poco', label: 'Un poco' },
    ],
  },
  {
    id: 'dailyGoal',
    title: '¿Cuánto tiempo practicarás al día?',
    options: [
      { id: '5', label: '🌱  5 min · Casual' },
      { id: '10', label: '🌿  10 min · Regular' },
      { id: '15', label: '🌳  15 min · Serio' },
      { id: '20', label: '🌲  20+ min · Intenso' },
    ],
  },
  {
    id: 'motivations',
    title: '¿Qué te motiva?',
    multi: true,
    options: [
      { id: 'escuela', label: '🎓  Escuela' },
      { id: 'trabajo', label: '💼  Trabajo' },
      { id: 'cultura', label: '🎨  Cultura' },
      { id: 'viajes', label: '✈️  Viajes' },
      { id: 'curiosidad', label: '🔍  Curiosidad' },
    ],
  },
];

export default function SurveyScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const { survey } = useAppState();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    motivations: survey.motivations,
  });

  const q = QUESTIONS[index];
  const selected = answers[q.id] ?? [];

  const toggle = (optionId: string) => {
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      if (q.multi) {
        return {
          ...prev,
          [q.id]: current.includes(optionId)
            ? current.filter((x) => x !== optionId)
            : [...current, optionId],
        };
      }
      return { ...prev, [q.id]: [optionId] };
    });
  };

  const next = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
      return;
    }
    dispatch({
      type: 'SET_SURVEY',
      survey: {
        ageRange: answers.ageRange?.[0],
        studiedBefore: answers.studiedBefore?.[0],
        dailyGoal: answers.dailyGoal?.[0],
        motivations: answers.motivations ?? [],
      },
    });
    go({ name: 'family' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Mascot kind="yaku" size={72} mood="thinking" bounce={false} />
        <Text style={[styles.notebook, { color: theme.textMuted }]}>
          📓 Yaku toma nota para personalizar tu aprendizaje…
        </Text>
      </View>

      <ProgressBar value={(index + 1) / QUESTIONS.length} theme={theme} />

      <Text style={[styles.question, { color: theme.text }]}>{q.title}</Text>

      <ScrollView style={styles.options}>
        {q.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <Pressable key={opt.id} onPress={() => toggle(opt.id)}>
              <Card
                theme={theme}
                style={{
                  marginBottom: spacing.sm,
                  borderColor: isSelected ? theme.primary : theme.border,
                  borderWidth: 2,
                  borderRadius: radius.md,
                  backgroundColor: isSelected ? theme.surfaceAlt : theme.surface,
                }}
              >
                <Text style={{ fontSize: 17, color: theme.text, fontWeight: isSelected ? '700' : '400' }}>
                  {isSelected ? '✅  ' : ''}
                  {opt.label}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>

      <Button
        title={index < QUESTIONS.length - 1 ? 'Siguiente' : '¡Listo!'}
        theme={theme}
        disabled={selected.length === 0}
        onPress={next}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  notebook: {
    flex: 1,
    fontSize: 13,
  },
  question: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: spacing.lg,
  },
  options: {
    flex: 1,
  },
});
