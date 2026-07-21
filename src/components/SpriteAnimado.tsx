import React, { useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';

export interface SpriteAnim {
  frames: number;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  fps: number;
  sheet: string; // data URI
}

interface Props {
  anim: SpriteAnim;
  size?: number; // ancho del fotograma en px
  loop?: boolean;
  onEnd?: () => void;
}

// Reproductor de hojas de sprites: funciona igual en Android, iOS y web.
export default function SpriteAnimado({ anim, size = 220, loop = true, onEnd }: Props) {
  const [frame, setFrame] = useState(0);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    setFrame(0);
    const id = setInterval(() => {
      setFrame((f) => {
        if (f + 1 >= anim.frames) {
          if (loop) return 0;
          clearInterval(id);
          onEndRef.current?.();
          return f;
        }
        return f + 1;
      });
    }, 1000 / anim.fps);
    return () => clearInterval(id);
  }, [anim, loop]);

  const scale = size / anim.frameWidth;
  const fw = anim.frameWidth * scale;
  const fh = anim.frameHeight * scale;
  const col = frame % anim.columns;
  const row = Math.floor(frame / anim.columns);
  const rows = Math.ceil(anim.frames / anim.columns);

  return (
    <View style={{ width: fw, height: fh, overflow: 'hidden' }}>
      <Image
        source={{ uri: anim.sheet }}
        style={{
          position: 'absolute',
          left: -col * fw,
          top: -row * fh,
          width: anim.columns * fw,
          height: rows * fh,
        }}
        resizeMode="stretch"
        fadeDuration={0}
      />
    </View>
  );
}
