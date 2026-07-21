import React from 'react';
import SpriteAnimado from './SpriteAnimado';
import { YAKU_ANIM } from './yakuAnim';

// Animación de reposo de Yaku (balanceo, guiño y risa), en bucle.
export default function YakuAnimado({ size = 220 }: { size?: number }) {
  return <SpriteAnimado anim={YAKU_ANIM} size={size} loop />;
}
