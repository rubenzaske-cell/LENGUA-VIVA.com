import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

// Placeholder ilustrado de las mascotas. Se reemplazará por el arte final
// (Yaku el delfín rosado y el Cóndor bebé) cuando estén los assets.

export type MascotKind = 'yaku' | 'condor';
export type MascotMood = 'happy' | 'celebrating' | 'encouraging' | 'thinking';

const FACES: Record<MascotKind, string> = {
  yaku: '🐬',
  condor: '🐥',
};

const MOOD_DECOR: Record<MascotMood, string> = {
  happy: '✨',
  celebrating: '🎉',
  encouraging: '💪',
  thinking: '🤔',
};

const COLORS: Record<MascotKind, string> = {
  yaku: '#F48FB1', // rosado del bufeo
  condor: '#B0BEC5', // gris andino
};

interface Props {
  kind: MascotKind;
  mood?: MascotMood;
  size?: number;
  bounce?: boolean;
}

export default function Mascot({ kind, mood = 'happy', size = 96, bounce = true }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!bounce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bounce, translateY]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: COLORS[kind],
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.5 }}>{FACES[kind]}</Text>
        <Text style={[styles.decor, { fontSize: size * 0.22 }]}>{MOOD_DECOR[mood]}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
});
