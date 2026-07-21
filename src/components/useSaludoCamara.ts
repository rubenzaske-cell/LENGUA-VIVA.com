import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

// Detección de saludo con la cámara, sin interfaz propia: pide permiso al
// montarse, analiza el movimiento en segundo plano y llama a onSaludo()
// cuando detecta un vaivén horizontal (una mano diciendo "hola").
// Todo el análisis ocurre en el dispositivo; el video nunca sale de él.
//
// Fase futura: reemplazar por un detector de manos (MediaPipe Hands) para
// distinguir una mano real de cualquier otro movimiento oscilante.

export default function useSaludoCamara(onSaludo: () => void, activo = true) {
  const onSaludoRef = useRef(onSaludo);
  onSaludoRef.current = onSaludo;

  useEffect(() => {
    if (!activo || Platform.OS !== 'web') return;
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    if (!nav?.mediaDevices?.getUserMedia) return;

    let stream: any = null;
    let timer: any = null;
    let cancelado = false;

    const doc: any = document;
    const video = doc.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    const canvas = doc.createElement('canvas');
    const W = 64;
    const H = 48;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let prev: Uint8ClampedArray | null = null;
    let lastCx: number | null = null;
    let dir = 0;
    let cambios: number[] = [];
    let enfriamiento = 0; // no re-disparar mientras Yaku aún saluda

    nav.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
      .then((s: any) => {
        if (cancelado) {
          s.getTracks().forEach((t: any) => t.stop());
          return;
        }
        stream = s;
        video.srcObject = s;
        video.play?.().catch(() => {});

        timer = setInterval(() => {
          if (video.readyState < 2) return;
          ctx.drawImage(video, 0, 0, W, H);
          const data = ctx.getImageData(0, 0, W, H).data;
          const ahora = Date.now();
          if (prev && ahora > enfriamiento) {
            let count = 0;
            let sumX = 0;
            for (let i = 0; i < W * H; i++) {
              const j = i * 4;
              const g1 = (data[j] + data[j + 1] + data[j + 2]) / 3;
              const g0 = (prev[j] + prev[j + 1] + prev[j + 2]) / 3;
              if (Math.abs(g1 - g0) > 28) {
                count++;
                sumX += i % W;
              }
            }
            if (count > 35) {
              const cx = sumX / count;
              if (lastCx !== null) {
                const delta = cx - lastCx;
                if (Math.abs(delta) > 1.5) {
                  const nuevoDir = delta > 0 ? 1 : -1;
                  if (dir !== 0 && nuevoDir !== dir) cambios.push(ahora);
                  dir = nuevoDir;
                }
              }
              lastCx = cx;
            }
            cambios = cambios.filter((t) => ahora - t < 1700);
            // 3 cambios de dirección en ~1.7s = alguien está saludando
            if (cambios.length >= 3) {
              cambios = [];
              enfriamiento = ahora + 6000;
              onSaludoRef.current();
            }
          }
          prev = new Uint8ClampedArray(data);
        }, 100);
      })
      .catch(() => {
        // sin permiso o sin cámara: Yaku simplemente se queda en reposo
      });

    return () => {
      cancelado = true;
      if (timer) clearInterval(timer);
      if (stream) stream.getTracks().forEach((t: any) => t.stop());
      video.remove();
    };
  }, [activo]);
}
