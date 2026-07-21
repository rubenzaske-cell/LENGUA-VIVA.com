import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CONDOR_SVG, YAKU_SVG } from './mascotArt';

// Yaku (delfín rosado) y el Cóndor bebé, en arte vectorial.

export type MascotKind = 'yaku' | 'condor';
export type MascotMood = 'happy' | 'celebrating' | 'encouraging' | 'thinking';

const MOOD_DECOR: Record<MascotMood, string> = {
  happy: '',
  celebrating: '🎉',
  encouraging: '💪',
  thinking: '📝',
};

// Relación de aspecto de cada SVG (alto / ancho de su viewBox).
const RATIO: Record<MascotKind, number> = {
  yaku: 256 / 200,
  condor: 230 / 200,
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

  const decor = MOOD_DECOR[mood];

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View style={{ width: size, height: size * RATIO[kind] }}>
        <SvgXml
          xml={kind === 'yaku' ? YAKU_SVG : CONDOR_SVG}
          width="100%"
          height="100%"
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
