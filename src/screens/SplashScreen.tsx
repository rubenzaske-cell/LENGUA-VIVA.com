import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const dolphinScale = useRef(new Animated.Value(1)).current;

  // La cámara observa en segundo plano: si saludas con la mano, Yaku responde.
  // (Solo funciona en contexto seguro: HTTPS o localhost.)
  const { estado: camara, activar: activarCamara } = useSaludoCamara(() =>
    setSaludando(true)
  );

  // Saludo manual: tocar a Yaku siempre funciona, aun sin cámara.
  const saludar = () => {
    if (!saludando) setSaludando(true);
  };

  // Al saludar, Yaku crece con un resorte suave; al terminar, vuelve a su tamaño.
  useEffect(() => {
    Animated.spring(dolphinScale, {
      toValue: saludando ? 1.18 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [saludando, dolphinScale]);

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

      {/* Ambas animaciones comparten recorte y tamaño: el cambio es invisible.
          La burbuja va superpuesta para no desplazar a Yaku. */}
      <Animated.View
        style={{ transform: [{ translateY: dolphinY }, { scale: dolphinScale }] }}
      >
        <Pressable onPress={saludar} accessibilityRole="button" accessibilityLabel="Saludar a Yaku">
          {saludando ? (
            <SpriteAnimado
              anim={YAKU_SALUDO}
              size={185}
              loop={false}
              onEnd={() => setSaludando(false)}
            />
          ) : (
            <Mascot kind="yaku" size={185} />
          )}
          {saludando && (
            <View style={styles.burbuja}>
              <Text style={styles.burbujaTexto}>¡Hola! 👋</Text>
            </View>
          )}
        </Pressable>
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
      <Animated.View style={{ opacity: subtitleOpacity, alignItems: 'center' }}>
        {camara === 'activa' ? (
          <Text style={styles.hint}>📷 ¡Salúdalo con tu mano frente a la cámara! 👋</Text>
        ) : (
          <Text style={styles.hint}>Toca a Yaku para saludarlo 👋</Text>
        )}

        {(camara === 'bloqueada' || camara === 'inactiva') && (
          <Pressable onPress={activarCamara} style={styles.camBtn}>
            <Text style={styles.camBtnText}>📷 Activar saludo con cámara</Text>
          </Pressable>
        )}
        {camara === 'bloqueada' && (
          <Text style={styles.camNote}>
            La cámara solo funciona con la app abierta por HTTPS o localhost.
          </Text>
        )}
      </Animated.View>

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
  camBtn: {
    marginTop: spacing.sm,
    backgroundColor: '#FFFFFF22',
    borderColor: '#FFFFFF88',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  camBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  camNote: {
    marginTop: spacing.xs,
    fontSize: 11,
    color: '#CFE9D4CC',
    textAlign: 'center',
    maxWidth: 300,
  },
  cta: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  burbuja: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  burbujaTexto: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2A4A32',
  },
});
