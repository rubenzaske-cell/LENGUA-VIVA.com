import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Theme } from '../theme';

// Fondo decorativo de la Bienvenida: inspirado en la selva amazónica peruana
// y el kené, el arte geométrico del pueblo Shipibo-Konibo (el mismo que se
// explica en las cápsulas culturales de la app). Es puramente decorativo:
// no capta toques (pointerEvents="none") y usa un lienzo de coordenadas fijo
// que se recorta para llenar cualquier tamaño de pantalla sin deformarse.

const W = 400;
const H = 800;

// Línea en zigzag (motivo geométrico tipo kené), de x=0 a x=W.
function zigzag(y: number, amplitude: number, segments: number): string {
  const step = W / segments;
  let d = `M 0 ${y}`;
  for (let i = 1; i <= segments; i++) {
    const x = i * step;
    const yy = i % 2 === 0 ? y : y - amplitude;
    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  return d;
}

// Fila de rombos concéntricos: el motivo más característico del kené shipibo.
function diamonds(cy: number, count: number, size: number): string {
  const step = W / count;
  let d = '';
  for (let i = 0; i < count; i++) {
    const cx = step * (i + 0.5);
    d += ` M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`;
  }
  return d.trim();
}

export default function SplashBackground({ theme }: { theme: Theme }) {
  return (
    <View style={styles.fill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id="lvBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.jungleDeep} stopOpacity={1} />
            <Stop offset="0.55" stopColor={theme.jungle} stopOpacity={1} />
            <Stop offset="1" stopColor={theme.jungleDeep} stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="lvGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={W} height={H} fill="url(#lvBg)" />

        {/* Resplandor suave donde emerge Yaku */}
        <Circle cx={W / 2} cy={330} r={210} fill="url(#lvGlow)" />

        {/* Franjas de kené (arte geométrico shipibo-konibo), arriba y abajo */}
        <Path d={zigzag(44, 16, 14)} stroke={theme.gold} strokeWidth={3} fill="none" opacity={0.5} />
        <Path d={zigzag(60, 10, 14)} stroke={theme.earth} strokeWidth={2} fill="none" opacity={0.35} />
        <Path d={diamonds(30, 9, 9)} stroke={theme.gold} strokeWidth={2} fill="none" opacity={0.4} />
        <Path d={zigzag(H - 44, 16, 14)} stroke={theme.gold} strokeWidth={3} fill="none" opacity={0.5} />
        <Path d={zigzag(H - 60, 10, 14)} stroke={theme.earth} strokeWidth={2} fill="none" opacity={0.35} />
        <Path d={diamonds(H - 30, 9, 9)} stroke={theme.gold} strokeWidth={2} fill="none" opacity={0.4} />

        {/* Grecas kené laterales (líneas verticales con quiebres) muy tenues */}
        <Path
          d={`M 14 120 L 14 ${H - 120} M 26 150 L 26 ${H - 150}`}
          stroke={theme.gold}
          strokeWidth={1.5}
          fill="none"
          opacity={0.12}
        />
        <Path
          d={`M ${W - 14} 120 L ${W - 14} ${H - 120} M ${W - 26} 150 L ${W - 26} ${H - 150}`}
          stroke={theme.gold}
          strokeWidth={1.5}
          fill="none"
          opacity={0.12}
        />
      </Svg>

      {/* Símbolos de la selva amazónica peruana, como textura ambiental sutil */}
      <Text style={[styles.symbol, { top: 74, left: 16, fontSize: 46 }]}>🌿</Text>
      <Text style={[styles.symbol, { top: 56, right: 20, fontSize: 40 }]}>🦜</Text>
      <Text style={[styles.symbol, { top: 138, right: 44, fontSize: 28 }]}>🌺</Text>
      <Text style={[styles.symbol, { top: 18, left: '40%', fontSize: 28 }]}>☀️</Text>
      <Text style={[styles.symbol, { bottom: 160, left: 22, fontSize: 40 }]}>🍃</Text>
      <Text style={[styles.symbol, { bottom: 200, right: 18, fontSize: 32 }]}>🪶</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  symbol: {
    position: 'absolute',
    opacity: 0.16,
  },
});
