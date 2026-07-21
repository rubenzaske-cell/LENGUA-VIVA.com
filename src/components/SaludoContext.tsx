import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSaludoCamara, { EstadoCamara } from './useSaludoCamara';

// Sistema global de saludo: la cámara frontal observa una sola vez para TODA la
// app (no se reinicia al cambiar de pantalla). Cuando detecta un saludo con la
// mano, `saludando` se pone en true y cualquier Yaku en pantalla (el grande de
// la bienvenida o el flotante de las demás pantallas) responde con su
// animación. También se puede saludar manualmente tocando a Yaku.

interface SaludoContextValue {
  saludando: boolean;
  estadoCamara: EstadoCamara;
  activarCamara: () => void;
  saludar: () => void; // disparo manual (toque)
  terminarSaludo: () => void; // lo llama la animación al terminar
}

const SaludoContext = createContext<SaludoContextValue>({
  saludando: false,
  estadoCamara: 'inactiva',
  activarCamara: () => {},
  saludar: () => {},
  terminarSaludo: () => {},
});

export function SaludoProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const [saludando, setSaludando] = useState(false);
  const fallback = useRef<any>(null);

  const disparar = useCallback(() => {
    setSaludando(true);
    if (fallback.current) clearTimeout(fallback.current);
    // Red de seguridad: si ningún Yaku está montado para avisar el fin de la
    // animación, se reinicia solo (la animación dura ~5 s).
    fallback.current = setTimeout(() => setSaludando(false), 6000);
  }, []);

  const terminarSaludo = useCallback(() => {
    if (fallback.current) clearTimeout(fallback.current);
    setSaludando(false);
  }, []);

  const { estado, activar } = useSaludoCamara(disparar, enabled);

  const value = useMemo(
    () => ({
      saludando,
      estadoCamara: estado,
      activarCamara: activar,
      saludar: disparar,
      terminarSaludo,
    }),
    [saludando, estado, activar, disparar, terminarSaludo]
  );

  return <SaludoContext.Provider value={value}>{children}</SaludoContext.Provider>;
}

export function useSaludo(): SaludoContextValue {
  return useContext(SaludoContext);
}
