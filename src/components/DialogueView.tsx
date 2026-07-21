import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from './UI';
import { Dialogue, VocabItem } from '../data/content';
import { radius, spacing, Theme } from '../theme';

// Lección de diálogo: dos personajes conversan usando el vocabulario recién
// practicado. Las palabras aprendidas se resaltan para que la persona vea cómo
// se usan en una conversación real. Las líneas se revelan una a una (a mano o
// con reproducción automática), como un chat.

function normalize(token: string): string {
  return token
    .toLowerCase()
    .replace(/[’]/g, "'") // unificar apóstrofos (glotalización)
    .replace(/[¡!¿?.,;:«»"()]/g, '')
    .trim();
}

// Conjunto de raíces del vocabulario de la lección para resaltar. Además de la
// palabra tal cual, se añade la raíz verbal (los verbos quechua se citan con
// la terminación -y: mikhuy → mikhu-, puriy → puri-) para que las formas
// conjugadas del diálogo también se resalten (mikhuni, purini, llank'ani...).
function vocabRoots(vocab: VocabItem[]): string[] {
  const roots = new Set<string>();
  for (const v of vocab) {
    for (const part of v.word.split(/\s+/)) {
      const n = normalize(part);
      if (n.length >= 3) roots.add(n);
      if (n.endsWith('y') && n.length - 1 >= 3) roots.add(n.slice(0, -1));
    }
  }
  return Array.from(roots);
}

function isLearned(token: string, roots: string[]): boolean {
  const n = normalize(token);
  if (n.length < 2) return false;
  return roots.some((r) => n.startsWith(r) || r.startsWith(n));
}

// Renderiza una frase resaltando las palabras del vocabulario de la lección.
function HighlightedLine({
  text,
  roots,
  color,
  accent,
}: {
  text: string;
  roots: string[];
  color: string;
  accent: string;
}) {
  const tokens = text.split(/(\s+)/); // conserva los espacios
  return (
    <Text style={[styles.native, { color }]}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <Text key={i}>{tok}</Text>;
        return isLearned(tok, roots) ? (
          <Text key={i} style={{ color: accent, fontWeight: '900' }}>
            {tok}
          </Text>
        ) : (
          <Text key={i}>{tok}</Text>
        );
      })}
    </Text>
  );
}

function Bubble({
  line,
  speaker,
  isRight,
  roots,
  theme,
  animate,
}: {
  line: { text: string; es: string };
  speaker: { name: string; emoji: string };
  isRight: boolean;
  roots: string[];
  theme: Theme;
  animate: boolean;
}) {
  const anim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, animate]);

  const bubbleColor = isRight ? theme.jungle : theme.surface;
  const textColor = isRight ? '#FFFFFF' : theme.text;
  const esColor = isRight ? '#FFFFFFCC' : theme.textMuted;
  const accent = isRight ? theme.gold : theme.primary;

  return (
    <Animated.View
      style={[
        styles.row,
        isRight ? styles.rowRight : styles.rowLeft,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          ],
        },
      ]}
    >
      {!isRight && <Text style={styles.avatar}>{speaker.emoji}</Text>}
      <View style={{ maxWidth: '78%' }}>
        <Text style={[styles.name, { color: theme.textMuted }, isRight && { textAlign: 'right' }]}>
          {speaker.name}
        </Text>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleColor,
              borderColor: theme.border,
              borderTopLeftRadius: isRight ? radius.lg : 4,
              borderTopRightRadius: isRight ? 4 : radius.lg,
            },
          ]}
        >
          <HighlightedLine text={line.text} roots={roots} color={textColor} accent={accent} />
          <Text style={[styles.es, { color: esColor }]}>{line.es}</Text>
        </View>
      </View>
      {isRight && <Text style={styles.avatar}>{speaker.emoji}</Text>}
    </Animated.View>
  );
}

export default function DialogueView({
  dialogue,
  vocab,
  theme,
  onDone,
}: {
  dialogue: Dialogue;
  vocab: VocabItem[];
  theme: Theme;
  onDone: () => void;
}) {
  const roots = useMemo(() => vocabRoots(vocab), [vocab]);
  const total = dialogue.lines.length;
  const [shown, setShown] = useState(1); // cuántas líneas se han revelado
  const [playing, setPlaying] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const done = shown >= total;

  const reveal = () => setShown((s) => Math.min(total, s + 1));

  // Reproducción automática: revela una línea cada 1.7 s.
  useEffect(() => {
    if (!playing || done) return;
    const id = setTimeout(reveal, 1700);
    return () => clearTimeout(id);
  }, [playing, shown, done]);

  useEffect(() => {
    if (done) setPlaying(false);
  }, [done]);

  useEffect(() => {
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(id);
  }, [shown]);

  const restart = () => {
    setShown(1);
    setPlaying(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.tag, { color: theme.river }]}>💬 CONVERSACIÓN REAL</Text>
        <Text style={[styles.title, { color: theme.text }]}>{dialogue.title}</Text>
        <Text style={[styles.setting, { color: theme.textMuted }]}>{dialogue.setting}</Text>
        <Text style={[styles.cast, { color: theme.textMuted }]}>
          {dialogue.a.emoji} {dialogue.a.name}   ·   {dialogue.b.emoji} {dialogue.b.name}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: spacing.md }}
      >
        {dialogue.lines.slice(0, shown).map((line, i) => (
          <Bubble
            key={i}
            line={line}
            speaker={line.speaker === 'a' ? dialogue.a : dialogue.b}
            isRight={line.speaker === 'b'}
            roots={roots}
            theme={theme}
            animate={i === shown - 1}
          />
        ))}
      </ScrollView>

      <View style={styles.controls}>
        {!done ? (
          <>
            <Button
              title={playing ? '⏸ Pausar' : '▶ Reproducir'}
              variant="ghost"
              theme={theme}
              onPress={() => setPlaying((p) => !p)}
              style={{ flex: 1 }}
            />
            <Button
              title="Siguiente ▶"
              theme={theme}
              onPress={reveal}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          <>
            <Button
              title="↺ Repetir"
              variant="ghost"
              theme={theme}
              onPress={restart}
              style={{ flex: 1 }}
            />
            <Button
              title="¡Entendido! ▶"
              theme={theme}
              onPress={onDone}
              style={{ flex: 1 }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tag: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  setting: { fontSize: 14, marginTop: 2, lineHeight: 20 },
  cast: { fontSize: 13, marginTop: spacing.xs, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  avatar: { fontSize: 30 },
  name: { fontSize: 12, fontWeight: '700', marginBottom: 2, marginHorizontal: 4 },
  bubble: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  native: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  es: { fontSize: 14, marginTop: 4, lineHeight: 19 },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
});
