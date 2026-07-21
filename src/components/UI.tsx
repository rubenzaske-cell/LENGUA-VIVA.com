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
import { radius, spacing, Theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  theme: Theme;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  theme,
  variant = 'primary',
  disabled,
  style,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const bg =
    variant === 'primary'
      ? theme.primary
      : variant === 'secondary'
      ? theme.jungle
      : 'transparent';
  const color = variant === 'ghost' ? theme.primary : theme.textOnPrimary;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={() =>
          Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
        }
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: disabled ? theme.locked : bg,
            borderColor: variant === 'ghost' ? theme.primary : 'transparent',
            borderWidth: variant === 'ghost' ? 2 : 0,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: disabled ? theme.textMuted : color }]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
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
  button: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
});
