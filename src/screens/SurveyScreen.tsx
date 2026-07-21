import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  id: 'ageRange' | 'studiedBefore' | 'studiedWhich' | 'dailyGoal' | 'motivations';
  title: string;
  hint?: string;
  multi?: boolean;
  // solo se muestra si la respuesta previa cumple la condición
  showIf?: (answers: Record<string, string[]>) => boolean;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'ageRange',
    title: '¿Cuántos años tienes?',
    hint: 'Así ajustamos el contenido para ti.',
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
      { id: 'si', label: '✅  Sí' },
      { id: 'no', label: '🌱  No, empiezo de cero' },
      { id: 'poco', label: '🙂  Un poco' },
    ],
  },
  {
    id: 'studiedWhich',
    title: '¡Qué bueno! ¿Cuál estudiaste?',
    showIf: (a) => ['si', 'poco'].includes(a.studiedBefore?.[0] ?? ''),
    options: [
      { id: 'quechua', label: 'Quechua' },
      { id: 'aimara', label: 'Aimara' },
      { id: 'shipibo', label: 'Shipibo-Konibo' },
      { id: 'ashaninka', label: 'Asháninka' },
      { id: 'otra', label: 'Otra lengua' },
    ],
  },
  {
    id: 'dailyGoal',
    title: '¿Cuánto tiempo practicarás al día?',
    hint: 'Puedes cambiarlo cuando quieras.',
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
    hint: 'Puedes elegir varias.',
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
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    motivations: survey.motivations,
  });
  const fade = useRef(new Animated.Value(1)).current;

  const visible = QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
  const q = visible[Math.min(index, visible.length - 1)];
  const selected = answers[q.id] ?? [];

  const changeQuestion = (nextIndex: number) => {
    Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setIndex(nextIndex);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

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
    if (index < visible.length - 1) {
      changeQuestion(index + 1);
      return;
    }
    dispatch({
      type: 'SET_SURVEY',
      survey: {
        ageRange: answers.ageRange?.[0],
        studiedBefore: answers.studiedBefore?.[0],
        studiedWhich: answers.studiedWhich?.[0],
        dailyGoal: answers.dailyGoal?.[0],
        motivations: answers.motivations ?? [],
      },
    });
    setDone(true);
  };

  // Pantalla de cierre: Yaku guarda el cuaderno.
  if (done) {
    return (
      <View style={[styles.doneContainer, { backgroundColor: theme.background }]}>
        <Mascot kind="yaku" size={150} />
        <Text style={[styles.doneTitle, { color: theme.text }]}>¡Perfecto!</Text>
        <Text style={[styles.doneSub, { color: theme.textMuted }]}>
          Yaku ya anotó todo en su cuaderno. Ahora elige qué lenguas quieres aprender.
        </Text>
        <Button
          title="Elegir mi lengua"
          theme={theme}
          onPress={() => go({ name: 'family' })}
          style={{ alignSelf: 'stretch', marginTop: spacing.xl }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => (index > 0 ? changeQuestion(index - 1) : go({ name: 'onboarding' }))}
          hitSlop={12}
        >
          <Text style={{ fontSize: 24, color: theme.textMuted }}>←</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <ProgressBar value={(index + 1) / visible.length} theme={theme} />
        </View>
        <Text style={[styles.stepLabel, { color: theme.textMuted }]}>
          {index + 1}/{visible.length}
        </Text>
      </View>

      <View style={styles.header}>
        <Mascot kind="yaku" size={64} />
        <View style={[styles.notebookBubble, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>
            📓 Yaku toma nota para personalizar tu aprendizaje…
          </Text>
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <Text style={[styles.question, { color: theme.text }]}>{q.title}</Text>
        {q.hint && (
          <Text style={[styles.hint, { color: theme.textMuted }]}>{q.hint}</Text>
        )}

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
                  <View style={styles.optionRow}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: theme.text,
                        fontWeight: isSelected ? '700' : '400',
                        flex: 1,
                      }}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <Text style={{ fontSize: 17 }}>✅</Text>}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      <Button
        title={index < visible.length - 1 ? 'Siguiente' : '¡Listo!'}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepLabel: {
    marginLeft: spacing.md,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notebookBubble: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  question: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.lg,
  },
  hint: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  options: {
    flex: 1,
    marginTop: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  doneTitle: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: spacing.lg,
  },
  doneSub: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
});
