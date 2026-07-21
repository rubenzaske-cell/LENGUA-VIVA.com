import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import { Button, Card, TypingText } from '../components/UI';
import { useNavigation } from '../navigation';
import { useAppDispatch } from '../state/store';
import { radius, spacing, Theme } from '../theme';

const DIALOG = [
  '¡Hola!',
  'Soy Yaku, tu amigo de la Amazonía.',
  'Estaré contigo durante todo tu aprendizaje.',
];

export default function OnboardingScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [lineDone, setLineDone] = useState(false);

  const finished = step >= DIALOG.length - 1 && lineDone;

  const next = () => {
    if (step < DIALOG.length - 1) {
      setStep(step + 1);
      setLineDone(false);
    }
  };

  const continueToSurvey = () => {
    dispatch({ type: 'ONBOARDED' });
    go({ name: 'survey' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Mascot kind="yaku" size={150} mood="happy" />

      <Card theme={theme} style={styles.bubble}>
        <TypingText
          text={DIALOG[step]}
          style={{ fontSize: 20, color: theme.text, fontWeight: '600' }}
          onDone={() => setLineDone(true)}
        />
        {/* pico de la burbuja */}
        <View style={[styles.tail, { borderBottomColor: theme.surface }]} />
      </Card>

      <View style={styles.actions}>
        {finished ? (
          <Button title="Continuar" theme={theme} onPress={continueToSurvey} />
        ) : (
          <Button
            title="Siguiente"
            theme={theme}
            variant="secondary"
            disabled={!lineDone}
            onPress={next}
          />
        )}
        <Text
          onPress={continueToSurvey}
          style={[styles.skip, { color: theme.textMuted }]}
        >
          Saltar introducción
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  bubble: {
    marginTop: spacing.xl,
    minWidth: 260,
    maxWidth: 340,
    borderRadius: radius.lg,
  },
  tail: {
    position: 'absolute',
    top: -12,
    left: 40,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  actions: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  skip: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
