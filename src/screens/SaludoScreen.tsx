import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import SpriteAnimado from '../components/SpriteAnimado';
import YakuAnimado from '../components/YakuAnimado';
import { YAKU_SALUDO } from '../components/yakuSaludoAnim';
import { Button, Card } from '../components/UI';
import { useNavigation } from '../navigation';
import { radius, spacing, Theme } from '../theme';

// Saluda a Yaku: la cámara detecta un movimiento de vaivén (como una mano
// diciendo "hola") y Yaku responde saludando con la aleta.
//
// La detección es por análisis de movimiento (diferencia entre fotogramas y
// oscilación horizontal del centro del movimiento). En una fase posterior se
// puede reemplazar por un detector de manos (MediaPipe Hands / Vision).

type CamState = 'pidiendo' | 'activa' | 'denegada' | 'no-web';

export default function SaludoScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const [camState, setCamState] = useState<CamState>(
    Platform.OS === 'web' ? 'pidiendo' : 'no-web'
  );
  const [saludando, setSaludando] = useState(false);
  const [saludos, setSaludos] = useState(0);
  const saludandoRef = useRef(false);
  saludandoRef.current = saludando;

  const videoBoxRef = useRef<View>(null);
  const videoElRef = useRef<any>(null);
  const cleanupRef = useRef<() => void>(() => {});

  const disparo = () => {
    if (saludandoRef.current) return;
    setSaludando(true);
    setSaludos((n) => n + 1);
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    if (!nav?.mediaDevices?.getUserMedia) {
      setCamState('denegada');
      return;
    }

    let stream: any = null;
    let timer: any = null;
    const doc: any = document;
    const video = doc.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.transform = 'scaleX(-1)'; // espejo, como un selfie
    video.style.borderRadius = '14px';

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

    nav.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
      .then((s: any) => {
        stream = s;
        video.srcObject = s;
        videoElRef.current = video;
        setCamState('activa'); // el efecto de abajo monta el <video> al renderizarse el contenedor

        timer = setInterval(() => {
          if (video.readyState < 2) return;
          ctx.drawImage(video, 0, 0, W, H);
          const data = ctx.getImageData(0, 0, W, H).data;
          if (prev) {
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
            const ahora = Date.now();
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
              disparo();
            }
          }
          prev = new Uint8ClampedArray(data);
        }, 100);
      })
      .catch(() => setCamState('denegada'));

    cleanupRef.current = () => {
      if (timer) clearInterval(timer);
      if (stream) stream.getTracks().forEach((t: any) => t.stop());
      video.remove();
    };
    return () => cleanupRef.current();
  }, []);

  // Cuando la cámara está activa y el contenedor ya se renderizó, montar el <video>.
  useEffect(() => {
    if (camState !== 'activa') return;
    const node: any = videoBoxRef.current;
    const video = videoElRef.current;
    if (node && video && typeof node.appendChild === 'function' && !video.isConnected) {
      node.appendChild(video);
      video.play?.().catch(() => {});
    }
  }, [camState]);

  const estadoTexto =
    camState === 'pidiendo'
      ? 'Pidiendo permiso de cámara…'
      : camState === 'activa'
      ? saludando
        ? '¡Yaku te está saludando! 👋'
        : 'Cámara activa: mueve tu mano de lado a lado para saludar 👋'
      : camState === 'denegada'
      ? 'No pude acceder a la cámara. Puedes probar el saludo con el botón.'
      : 'La detección con cámara estará disponible pronto en la app móvil. Prueba el saludo con el botón.';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topRow}>
        <Pressable onPress={() => go({ name: 'ladder' })} hitSlop={12}>
          <Text style={{ fontSize: 24, color: theme.textMuted }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Saluda a Yaku</Text>
        <Text style={{ fontSize: 14, color: theme.textMuted }}>👋 {saludos}</Text>
      </View>

      <View style={styles.mascota}>
        {saludando ? (
          <>
            <View style={[styles.burbuja, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>
                ¡Hola! 👋
              </Text>
            </View>
            <SpriteAnimado
              anim={YAKU_SALUDO}
              size={210}
              loop={false}
              onEnd={() => setSaludando(false)}
            />
          </>
        ) : (
          <YakuAnimado size={180} />
        )}
      </View>

      <Card theme={theme} style={styles.estado}>
        <Text style={{ fontSize: 14, color: theme.textMuted, textAlign: 'center' }}>
          {estadoTexto}
        </Text>
      </Card>

      {/* vista de la cámara (solo web) */}
      {camState === 'activa' && (
        <View
          ref={videoBoxRef}
          style={[styles.video, { borderColor: theme.border }]}
        />
      )}

      <Button
        title="Probar el saludo 👋"
        theme={theme}
        variant="secondary"
        onPress={disparo}
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  mascota: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 330,
  },
  burbuja: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  estado: {
    marginTop: spacing.md,
  },
  video: {
    height: 150,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
});
