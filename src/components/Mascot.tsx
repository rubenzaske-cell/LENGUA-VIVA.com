import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { CONDOR_PNG, CONDOR_SIZE, YAKU_PNG, YAKU_SIZE } from './mascotArt';
import YakuAnimado from './YakuAnimado';

// Yaku (delfín rosado) y el Cóndor bebé — arte oficial del proyecto.

export type MascotKind = 'yaku' | 'condor';
export type MascotMood = 'happy' | 'celebrating' | 'encouraging' | 'thinking';

const MOOD_DECOR: Record<MascotMood, string> = {
  happy: '',
  celebrating: '🎉',
  encouraging: '💪',
  thinking: '📝',
};

const ART: Record<MascotKind, { uri: string; ratio: number }> = {
  yaku: { uri: YAKU_PNG, ratio: YAKU_SIZE.height / YAKU_SIZE.width },
  condor: { uri: CONDOR_PNG, ratio: CONDOR_SIZE.height / CONDOR_SIZE.width },
};

interface Props {
  kind: MascotKind;
  mood?: MascotMood;
  size?: number; // ancho en px
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

  const art = ART[kind];
  const decor = MOOD_DECOR[mood];

  // Modo reposo de Yaku: la animación oficial (balanceo, guiño y risa).
  // El fotograma está recortado al personaje, así que el ancho coincide.
  if (kind === 'yaku' && bounce && mood === 'happy') {
    return <YakuAnimado size={size} />;
  }

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View style={{ width: size, height: size * art.ratio }}>
        <Image
          source={{ uri: art.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
        {decor !== '' && (
          <Text style={[styles.decor, { fontSize: Math.max(16, size * 0.24) }]}>{decor}</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  decor: {
    position: 'absolute',
    top: -4,
    right: -8,
  },
});
