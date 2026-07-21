import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { YAKU_ANIM } from './yakuAnim';

// Reproduce la animación de reposo de Yaku (saludo y guiño) desde la
// hoja de sprites. Funciona igual en Android, iOS y web.

export default function YakuAnimado({ size = 220 }: { size?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % YAKU_ANIM.frames);
    }, 1000 / YAKU_ANIM.fps);
    return () => clearInterval(id);
  }, []);

  const scale = size / YAKU_ANIM.frameWidth;
  const fw = YAKU_ANIM.frameWidth * scale;
  const fh = YAKU_ANIM.frameHeight * scale;
  const col = frame % YAKU_ANIM.columns;
  const row = Math.floor(frame / YAKU_ANIM.columns);
  const rows = Math.ceil(YAKU_ANIM.frames / YAKU_ANIM.columns);

  return (
    <View style={{ width: fw, height: fh, overflow: 'hidden' }}>
      <Image
        source={{ uri: YAKU_ANIM.sheet }}
        style={{
          position: 'absolute',
          left: -col * fw,
          top: -row * fh,
          width: YAKU_ANIM.columns * fw,
          height: rows * fh,
        }}
        resizeMode="stretch"
        fadeDuration={0}
      />
    </View>
  );
}
