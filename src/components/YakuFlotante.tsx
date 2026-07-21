import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Mascot from './Mascot';
import SpriteAnimado from './SpriteAnimado';
import { YAKU_SALUDO } from './yakuSaludoAnim';
import { useSaludo } from './SaludoContext';
import { Theme } from '../theme';

// Yaku flotante: aparece en una esquina en todas las pantallas (menos la
// bienvenida, que ya tiene su Yaku grande). Reacciona al saludo detectado por
// la cámara y también se puede tocar para saludarlo manualmente.
export default function YakuFlotante({ theme }: { theme: Theme }) {
  const { saludando, saludar, terminarSaludo, estadoCamara, activarCamara } = useSaludo();

  return (
    // box-none: solo Yaku y el botón capturan toques; el resto pasa de largo.
    <View pointerEvents="box-none" style={styles.layer}>
      <View style={styles.corner} pointerEvents="box-none">
        {saludando && (
          <View style={[styles.burbuja, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            <Text style={styles.burbujaTexto}>¡Hola! 👋</Text>
          </View>
        )}

        <Pressable
          onPress={saludar}
          accessibilityRole="button"
          accessibilityLabel="Saludar a Yaku"
          style={[
            styles.yakuWrap,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {saludando ? (
            <SpriteAnimado anim={YAKU_SALUDO} size={92} loop={false} onEnd={terminarSaludo} />
          ) : (
            <Mascot kind="yaku" size={66} bounce={false} />
          )}
        </Pressable>

        {estadoCamara === 'activa' ? (
          <View style={[styles.camPill, { backgroundColor: theme.jungle }]}>
            <Text style={styles.camPillText}>📷 Yaku te ve</Text>
          </View>
        ) : (
          <Pressable
            onPress={activarCamara}
            style={[styles.camPill, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.camPillText}>📷 Activar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    right: 12,
    bottom: 74,
    alignItems: 'center',
  },
  yakuWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  burbuja: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  burbujaTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2A4A32',
  },
  camPill: {
    marginTop: 6,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  camPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
