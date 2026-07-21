import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import DialogueView from '../components/DialogueView';
import { Button, Card, ProgressBar } from '../components/UI';
import {
  cultureForLevel,
  dialogueForLevel,
  getLanguage,
  totalLevels,
  VocabItem,
  vocabForLevel,
} from '../data/content';
import { useNavigation } from '../navigation';
import { useAppDispatch, useAppState } from '../state/store';
import { radius, spacing, Theme } from '../theme';

type Exercise =
  | { kind: 'intro'; item: VocabItem }
  | { kind: 'choose-es'; item: VocabItem; options: string[] }
  | { kind: 'choose-word'; item: VocabItem; options: string[] }
  | { kind: 'choose-image'; item: VocabItem; options: string[] }
  | { kind: 'order-words'; item: VocabItem; chips: string[] }
  | { kind: 'match'; pairs: VocabItem[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExercises(vocab: VocabItem[], pool: VocabItem[]): Exercise[] {
  const exercises: Exercise[] = [];
  const distractors = (item: VocabItem, field: 'es' | 'word' | 'emoji') =>
    shuffle(
      pool.filter((v) => v.word !== item.word).map((v) => v[field])
    ).slice(0, 3);

  // 1) Introducción de vocabulario
  vocab.forEach((item) => exercises.push({ kind: 'intro', item }));

  // 2) Ejercicios por palabra
  vocab.forEach((item) => {
    exercises.push({
      kind: 'choose-es',
      item,
      options: shuffle([item.es, ...distractors(item, 'es')]),
    });
    exercises.push({
      kind: 'choose-image',
      item,
      options: shuffle([item.emoji, ...distractors(item, 'emoji')]),
    });
  });

  // 3) Traducción inversa para la mitad de las palabras
  vocab.slice(0, 2).forEach((item) => {
    exercises.push({
      kind: 'choose-word',
      item,
      options: shuffle([item.word, ...distractors(item, 'word')]),
    });
  });

  // 4) Ordenar palabras (solo frases de varias palabras)
  const phrase = vocab.find((v) => v.word.includes(' '));
  if (phrase) {
    const words = phrase.word.split(' ');
    const extra = pool.find((v) => !v.word.includes(' ') && !words.includes(v.word));
    exercises.push({
      kind: 'order-words',
      item: phrase,
      chips: shuffle([...words, ...(extra ? [extra.word] : [])]),
    });
  }

  // 5) Relacionar columnas
  exercises.push({ kind: 'match', pairs: vocab });

  return exercises;
}

export default function LessonScreen({ theme, level }: { theme: Theme; level: number }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const state = useAppState();

  const lang = getLanguage(state.languageId ?? '')!;
  const isAmazonia = state.family !== 'andes';
  const mascot = isAmazonia ? 'yaku' : 'condor';
  const vocab = useMemo(() => vocabForLevel(lang, level), [lang, level]);
  const [queue, setQueue] = useState<Exercise[]>(() => buildExercises(vocab, lang.vocab));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'exercises' | 'dialogue' | 'culture' | 'done'>(
    'exercises'
  );
  const errorsRef = useRef(0);

  // Estado de ejercicios interactivos
  const [orderPicked, setOrderPicked] = useState<string[]>([]);
  const [matchLeft, setMatchLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const culture = cultureForLevel(lang, level);
  const dialogue = dialogueForLevel(lang, level);
  const exercise = queue[index];
  const total = queue.length;

  const matchRight = useMemo(
    () => (exercise?.kind === 'match' ? shuffle(exercise.pairs) : []),
    [exercise]
  );

  const matchComplete =
    exercise?.kind === 'match' && matched.length === exercise.pairs.length;

  useEffect(() => {
    if (matchComplete && !feedback) answer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchComplete]);

  const advance = () => {
    setFeedback(null);
    setOrderPicked([]);
    setMatchLeft(null);
    setMatched([]);
    if (index < queue.length - 1) {
      setIndex(index + 1);
    } else if (dialogue) {
      // Al terminar los ejercicios: la conversación de la vida real.
      setPhase('dialogue');
    } else if (culture) {
      setPhase('culture');
    } else {
      finish();
    }
  };

  // Después del diálogo: cápsula cultural si existe, si no, terminar.
  const afterDialogue = () => {
    if (culture) {
      setPhase('culture');
    } else {
      finish();
    }
  };

  const finish = () => {
    const xp = correctCount * 10 + 20;
    dispatch({ type: 'COMPLETE_LEVEL', languageId: lang.id, level, xp, minutes: 5 });
    const today = new Date().toISOString();
    if (level === 1) {
      dispatch({
        type: 'ADD_BADGE',
        badge: { id: 'first-level', name: 'Primer escalón', emoji: '🌱', earnedAt: today },
      });
    }
    if (level === totalLevels(lang)) {
      dispatch({
        type: 'ADD_BADGE',
        badge: { id: 'summit', name: 'Cima del conocimiento', emoji: '⭐', earnedAt: today },
      });
    }
    if (state.streak + 1 >= 7) {
      dispatch({
        type: 'ADD_BADGE',
        badge: { id: 'streak-7', name: '7 días de racha', emoji: '🔥', earnedAt: today },
      });
    }
    setPhase('done');
  };

  const answer = (isCorrect: boolean) => {
    if (feedback) return;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setFeedback('correct');
    } else {
      errorsRef.current += 1;
      setFeedback('wrong');
      // IA adaptativa (regla simple): el ejercicio fallado se refuerza al final.
      setQueue((q) => [...q, q[index]]);
    }
  };

  if (phase === 'done') {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Mascot kind={mascot} size={130} mood="celebrating" />
        <Text style={[styles.doneTitle, { color: theme.text }]}>¡Nivel {level} completado!</Text>
        <Text style={[styles.doneStat, { color: theme.textMuted }]}>
          ⭐ +{correctCount * 10 + 20} XP · 🔥 Racha: {state.streak} día(s)
        </Text>
        {dialogue && (
          <Text style={[styles.doneSub, { color: theme.textMuted }]}>
            💬 Practicaste una conversación real con {dialogue.a.name} y {dialogue.b.name}.
          </Text>
        )}
        <Button
          title="Volver a la escalera"
          theme={theme}
          onPress={() => go({ name: 'ladder' })}
          style={{ alignSelf: 'stretch', marginTop: spacing.xl }}
        />
      </View>
    );
  }

  if (phase === 'dialogue' && dialogue) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => go({ name: 'ladder' })}>
            <Text style={{ fontSize: 22, color: theme.textMuted }}>✕</Text>
          </Pressable>
          <Text style={{ marginLeft: spacing.md, fontWeight: '800', color: theme.text }}>
            Así se usa en la vida real
          </Text>
        </View>
        <DialogueView
          dialogue={dialogue}
          vocab={vocab}
          theme={theme}
          onDone={afterDialogue}
        />
      </View>
    );
  }

  if (phase === 'culture' && culture) {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.cultureContainer}
      >
        <Mascot kind={mascot} size={90} mood="happy" />
        <Text style={[styles.cultureTag, { color: theme.gold }]}>📚 CÁPSULA CULTURAL</Text>
        <Text style={[styles.cultureTitle, { color: theme.text }]}>{culture.title}</Text>
        <Card theme={theme} style={{ marginTop: spacing.md }}>
          <Text style={{ fontSize: 16, lineHeight: 24, color: theme.text }}>{culture.body}</Text>
        </Card>
        <Button
          title="Continuar"
          theme={theme}
          onPress={finish}
          style={{ alignSelf: 'stretch', marginTop: spacing.xl }}
        />
      </ScrollView>
    );
  }

  const renderExercise = () => {
    switch (exercise.kind) {
      case 'intro':
        return (
          <View style={styles.centerBlock}>
            <Text style={[styles.prompt, { color: theme.textMuted }]}>📖 Palabra nueva</Text>
            <View
              style={[
                styles.introImage,
                { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
              ]}
            >
              <Text style={styles.introEmoji}>{exercise.item.emoji}</Text>
            </View>
            <Text style={[styles.word, { color: theme.text }]}>{exercise.item.word}</Text>
            <Text style={[styles.translation, { color: theme.textMuted }]}>{exercise.item.es}</Text>
            <Button title="Continuar" theme={theme} onPress={advance} style={{ alignSelf: 'stretch', marginTop: spacing.xl }} />
          </View>
        );
      case 'choose-image': {
        const correct = exercise.item.emoji;
        return (
          <View>
            <Text style={[styles.prompt, { color: theme.text }]}>
              Elige la imagen de “{exercise.item.word}”
            </Text>
            <View style={styles.imageGrid}>
              {exercise.options.map((opt, i) => (
                <Pressable
                  key={`${opt}-${i}`}
                  onPress={() => answer(opt === correct)}
                  disabled={!!feedback}
                  style={[
                    styles.imageOption,
                    {
                      backgroundColor: theme.surface,
                      borderColor:
                        feedback && opt === correct ? theme.success : theme.border,
                    },
                  ]}
                >
                  <Text style={styles.imageOptionEmoji}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      }
      case 'choose-es':
      case 'choose-word': {
        const prompt =
          exercise.kind === 'choose-es'
            ? `¿Qué significa “${exercise.item.word}”?`
            : `¿Cómo se dice “${exercise.item.es}”?`;
        const correct =
          exercise.kind === 'choose-es' ? exercise.item.es : exercise.item.word;
        return (
          <View>
            <Text style={[styles.prompt, { color: theme.text }]}>{prompt}</Text>
            {exercise.options.map((opt, i) => (
              <Pressable key={`${opt}-${i}`} onPress={() => answer(opt === correct)} disabled={!!feedback}>
                <Card
                  theme={theme}
                  style={{
                    marginBottom: spacing.sm,
                    borderWidth: 2,
                    borderColor:
                      feedback && opt === correct
                        ? theme.success
                        : theme.border,
                  }}
                >
                  <Text style={{ fontSize: 18, color: theme.text }}>{opt}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        );
      }
      case 'order-words': {
        const target = exercise.item.word.split(' ');
        return (
          <View>
            <Text style={[styles.prompt, { color: theme.text }]}>
              Ordena las palabras: “{exercise.item.es}”
            </Text>
            <Card theme={theme} style={{ minHeight: 64, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 20, color: theme.text }}>
                {orderPicked.join(' ') || ' '}
              </Text>
            </Card>
            <View style={styles.chips}>
              {exercise.chips.map((chip, i) => {
                const used = orderPicked.includes(chip);
                return (
                  <Pressable
                    key={`${chip}-${i}`}
                    disabled={used || !!feedback}
                    onPress={() => {
                      const next = [...orderPicked, chip];
                      setOrderPicked(next);
                      if (next.length === target.length) {
                        answer(next.join(' ') === exercise.item.word);
                      }
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: used ? theme.locked : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 17, color: theme.text }}>{chip}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Button
              title="Borrar"
              variant="ghost"
              theme={theme}
              onPress={() => setOrderPicked([])}
              style={{ marginTop: spacing.md }}
            />
          </View>
        );
      }
      case 'match': {
        return (
          <View>
            <Text style={[styles.prompt, { color: theme.text }]}>🧩 Relaciona cada palabra</Text>
            <View style={styles.matchColumns}>
              <View style={{ flex: 1 }}>
                {exercise.pairs.map((p) => (
                  <Pressable
                    key={p.word}
                    disabled={matched.includes(p.word)}
                    onPress={() => setMatchLeft(p.word)}
                    style={[
                      styles.matchItem,
                      {
                        backgroundColor: matched.includes(p.word)
                          ? theme.success
                          : matchLeft === p.word
                          ? theme.surfaceAlt
                          : theme.surface,
                        borderColor: matchLeft === p.word ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: matched.includes(p.word) ? '#FFF' : theme.text }}>
                      {p.word}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={{ flex: 1 }}>
                {matchRight.map((p) => (
                  <Pressable
                    key={p.es}
                    disabled={matched.includes(p.word)}
                    onPress={() => {
                      if (matchLeft === p.word) {
                        setMatched((m) => [...m, p.word]);
                        setMatchLeft(null);
                      } else if (matchLeft) {
                        errorsRef.current += 1;
                        setMatchLeft(null);
                      }
                    }}
                    style={[
                      styles.matchItem,
                      {
                        backgroundColor: matched.includes(p.word) ? theme.success : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: matched.includes(p.word) ? '#FFF' : theme.text }}>
                      {p.emoji} {p.es}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => go({ name: 'ladder' })}>
          <Text style={{ fontSize: 22, color: theme.textMuted }}>✕</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <ProgressBar value={(index + 1) / total} theme={theme} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {renderExercise()}
      </ScrollView>

      {feedback && (
        <View
          style={[
            styles.feedback,
            { backgroundColor: feedback === 'correct' ? '#E6F4E6' : '#FBE9E7' },
          ]}
        >
          <Mascot
            kind={mascot}
            size={54}
            bounce={false}
            mood={feedback === 'correct' ? 'celebrating' : 'encouraging'}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '800',
                color: feedback === 'correct' ? theme.success : theme.error,
              }}
            >
              {feedback === 'correct' ? '¡Muy bien!' : '¡No te preocupes, vamos a practicar un poco más!'}
            </Text>
            {feedback === 'wrong' && 'item' in exercise && (
              <Text style={{ color: theme.text, marginTop: 2 }}>
                Respuesta: {exercise.item.word} = {exercise.item.es}
              </Text>
            )}
          </View>
          <Button title="Seguir" theme={theme} onPress={advance} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl * 1.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centerBlock: { alignItems: 'center', paddingTop: spacing.lg },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  prompt: { fontSize: 20, fontWeight: '700', marginBottom: spacing.lg },
  word: { fontSize: 38, fontWeight: '900', marginTop: spacing.md },
  translation: { fontSize: 22, marginTop: spacing.xs },
  // Imagen grande estilo Duolingo para la palabra nueva.
  introImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  introEmoji: { fontSize: 132, lineHeight: 152, textAlign: 'center' },
  // Cuadrícula 2×2 de imágenes grandes para "elige la imagen".
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageOption: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  imageOptionEmoji: { fontSize: 96, lineHeight: 112, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  matchColumns: { flexDirection: 'row', gap: spacing.md },
  matchItem: {
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 2,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  doneTitle: { fontSize: 26, fontWeight: '900', marginTop: spacing.lg },
  doneStat: { fontSize: 16, marginTop: spacing.sm },
  doneSub: { fontSize: 14, marginTop: spacing.sm, textAlign: 'center', maxWidth: 320 },
  cultureContainer: { padding: spacing.lg, paddingTop: spacing.xl * 2, alignItems: 'center' },
  cultureTag: { fontSize: 13, fontWeight: '800', letterSpacing: 1, marginTop: spacing.md },
  cultureTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: spacing.xs },
});
