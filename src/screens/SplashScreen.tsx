import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascot';
import SpriteAnimado from '../components/SpriteAnimado';
import { YAKU_SALUDO } from '../components/yakuSaludoAnim';
import useSaludoCamara from '../components/useSaludoCamara';
import { Button } from '../components/UI';
import { useNavigation } from '../navigation';
import { spacing, Theme } from '../theme';

export default function SplashScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const [saludando, setSaludando] = useState(false);
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(12)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dolphinY = useRef(new Animated.Value(80)).current;

  // La cámara observa en segundo plano: si saludas con la mano, Yaku responde.
  useSaludoCamara(() => setSaludando(true));

  useEffect(() => {
    // Yaku emerge del agua, luego aparecen título y subtítulo.
    Animated.sequence([
      Animated.timing(dolphinY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dolphinY, titleOpacity, titleY, subtitleOpacity]);

  return (
    <View style={[styles.container, { backgroundColor: '#2BB24C' }]}>
      <View style={styles.sky}>
        <Text style={styles.ambient}>🌿🦜🌺</Text>
      </View>

      <Animated.View style={{ transform: [{ translateY: dolphinY }] }}>
        {saludando ? (
          <View style={{ alignItems: 'center' }}>
            <View style={styles.burbuja}>
              <Text style={styles.burbujaTexto}>¡Hola! 👋</Text>
            </View>
            <SpriteAnimado
              anim={YAKU_SALUDO}
              size={165}
              loop={false}
              onEnd={() => setSaludando(false)}
            />
          </View>
        ) : (
          <Mascot kind="yaku" size={150} />
        )}
      </Animated.View>

      {/* Río estilizado */}
      <View style={[styles.river, { backgroundColor: theme.river }]} />

      <Animated.Text
        style={[
          styles.title,
          { opacity: titleOpacity, transform: [{ translateY: titleY }] },
        ]}
      >
        ¡Bienvenido a Lengua Viva!
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Aprende las lenguas originarias del Perú de una manera divertida.
      </Animated.Text>
      <Animated.Text style={[styles.hint, { opacity: subtitleOpacity }]}>
        Salúdalo con tu mano 👋
      </Animated.Text>

      <Button
        title="Comenzar"
        theme={theme}
        onPress={() => go({ name: 'auth' })}
        style={styles.cta}
      />
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
  sky: {
    marginBottom: spacing.md,
  },
  ambient: {
    fontSize: 28,
    letterSpacing: 8,
  },
  river: {
    width: '80%',
    height: 14,
    borderRadius: 7,
    marginTop: spacing.sm,
    opacity: 0.7,
  },
  title: {
    marginTop: spacing.xl,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: '#E8F0E8',
    textAlign: 'center',
    maxWidth: 320,
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: '#CFE9D4',
    textAlign: 'center',
  },
  cta: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  burbuja: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 6,
  },
  burbujaTexto: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2A4A32',
  },
});
