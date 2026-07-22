import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { radius, spacing, Theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  theme: Theme;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

// Cenefa kené (textil peruano): dos líneas en zigzag con rombos, dibujadas muy
// tenues sobre el botón para darle identidad andino-amazónica sin restar
// legibilidad. El lienzo se estira a lo ancho del botón (preserveAspectRatio
// "none"), así funciona con cualquier tamaño.
function KeneTrim({ color }: { color: string }) {
  const VB_W = 240;
  const VB_H = 52;
  const seg = 12;
  const zig = (y: number, amp: number) => {
    let d = `M0 ${y}`;
    for (let x = seg; x <= VB_W; x += seg) {
      d += ` L${x} ${((x / seg) % 2 === 0 ? y : y - amp).toFixed(1)}`;
    }
    return d;
  };
  const diamonds = (cy: number, s: number) => {
    let d = '';
    for (let cx = seg; cx < VB_W; cx += seg * 2) {
      d += ` M${cx} ${cy - s} L${cx + s} ${cy} L${cx} ${cy + s} L${cx - s} ${cy} Z`;
    }
    return d.trim();
  };
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      pointerEvents="none"
    >
      <Path d={zig(8, 5)} stroke={color} strokeWidth={1.5} fill="none" opacity={0.55} />
      <Path d={zig(VB_H - 8, 5)} stroke={color} strokeWidth={1.5} fill="none" opacity={0.55} />
      <Path d={diamonds(8, 3)} stroke={color} strokeWidth={1} fill="none" opacity={0.4} />
      <Path d={diamonds(VB_H - 8, 3)} stroke={color} strokeWidth={1} fill="none" opacity={0.4} />
    </Svg>
  );
}

export function Button({
  title,
  onPress,
  theme,
  variant = 'primary',
  disabled,
  style,
}: ButtonProps) {
  const DEPTH = 5; // altura del "escalón" 3D
  const press = useRef(new Animated.Value(0)).current; // 0 arriba, 1 presionado

  // Botón fantasma: variante plana con borde (para acciones secundarias).
  if (variant === 'ghost') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.ghost,
          {
            borderColor: theme.primary,
            opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
          },
          style,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.primary }]}>{title}</Text>
      </Pressable>
    );
  }

  const face = variant === 'secondary' ? theme.jungle : theme.primary;
  const base = variant === 'secondary' ? theme.jungleDeep : theme.primaryDark;
  const trim = variant === 'secondary' ? theme.gold : '#FFFFFF';

  const translateY = press.interpolate({ inputRange: [0, 1], outputRange: [0, DEPTH] });

  const setPressed = (to: number) =>
    Animated.spring(press, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={() => setPressed(1)}
        onPressOut={() => setPressed(0)}
        onPress={onPress}
      >
        {/* Base oscura: forma el "escalón" 3D que se ve al fondo. */}
        <View
          style={[
            styles.base,
            { backgroundColor: disabled ? theme.border : base, paddingBottom: DEPTH },
          ]}
        >
          {/* Cara del botón: sube y baja al presionar. */}
          <Animated.View
            style={[styles.face, { backgroundColor: disabled ? theme.locked : face, transform: [{ translateY }] }]}
          >
            {!disabled && <KeneTrim color={trim} />}
            <Text
              style={[
                styles.buttonText,
                styles.buttonTextRaised,
                { color: disabled ? theme.textMuted : theme.textOnPrimary },
              ]}
            >
              {title}
            </Text>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

export function Card({
  children,
  theme,
  style,
  onPress,
}: {
  children: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const inner = (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return inner;
  return <Pressable onPress={onPress}>{inner}</Pressable>;
}

export function ProgressBar({
  value,
  theme,
  height = 10,
}: {
  value: number; // 0..1
  theme: Theme;
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: theme.surfaceAlt,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, value * 100))}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: theme.jungle,
        }}
      />
    </View>
  );
}

// Texto que aparece letra por letra, como burbuja de diálogo estilo cómic.
export function TypingText({
  text,
  style,
  speed = 28,
  onDone,
}: {
  text: string;
  style?: TextStyle;
  speed?: number;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState('');
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <Text style={style}>{shown}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg + 2,
  },
  face: {
    borderRadius: radius.lg,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ghost: {
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonTextRaised: {
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
});
