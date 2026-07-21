import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Theme } from '../theme';

// En teléfonos (nativo o navegador angosto) la app ocupa toda la pantalla.
// En pantallas grandes (web de escritorio o tablet) se encuadra en un marco
// tipo teléfono centrado, para que no se estire de borde a borde.
//
// Modo pantalla completa: si el contenedor define la bandera global
// `__LV_FULLSCREEN__` (p. ej. una build embebida en un HTML autónomo), la app
// ocupa siempre toda la pantalla, sin marco, en cualquier tamaño.
const PHONE_WIDTH = 440;
const WIDE_BREAKPOINT = 700;

function fullscreenForced(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    (globalThis as { __LV_FULLSCREEN__?: boolean }).__LV_FULLSCREEN__ === true
  );
}

export default function ResponsiveShell({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const { width, height } = useWindowDimensions();
  const isWide =
    Platform.OS === 'web' && width >= WIDE_BREAKPOINT && !fullscreenForced();

  if (!isWide) {
    return <View style={styles.fill}>{children}</View>;
  }

  const frameHeight = Math.min(height - 48, 920);

  return (
    <View style={[styles.backdrop, { backgroundColor: theme.jungleDeep }]}>
      <View
        style={[
          styles.frame,
          {
            height: frameHeight,
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  frame: {
    width: PHONE_WIDTH,
    maxWidth: '100%',
    borderRadius: 34,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 24px 70px rgba(0,0,0,0.35)' },
      default: {},
    }),
  },
});
