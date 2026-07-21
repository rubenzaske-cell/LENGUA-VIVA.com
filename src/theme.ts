// Paleta inspirada en arte amazónico (kené shipibo) y textiles andinos.
export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  // Fondos
  background: string;
  surface: string;
  surfaceAlt: string;
  // Texto
  text: string;
  textMuted: string;
  textOnPrimary: string;
  // Marca
  primary: string; // naranja cálido (CTA)
  primaryDark: string;
  jungle: string; // verde selva
  jungleDeep: string;
  river: string; // azul de río
  andes: string; // rojo textil andino
  gold: string; // dorado andino
  earth: string; // marrón tierra
  // Estados
  success: string;
  error: string;
  locked: string;
  border: string;
}

export const lightTheme: Theme = {
  name: 'light',
  background: '#F7F3EA',
  surface: '#FFFFFF',
  surfaceAlt: '#EFE8D8',
  text: '#3A2E23',
  textMuted: '#8A7B68',
  textOnPrimary: '#FFFFFF',
  primary: '#F2820A',
  primaryDark: '#C96A05',
  jungle: '#3E8E5A',
  jungleDeep: '#1F5B38',
  river: '#3B82A0',
  andes: '#C0392B',
  gold: '#D9A404',
  earth: '#8B5E3C',
  success: '#4CAF50',
  error: '#E05243',
  locked: '#C9BFAF',
  border: '#E2D9C8',
};

export const darkTheme: Theme = {
  ...lightTheme,
  name: 'dark',
  background: '#1B2420',
  surface: '#25302B',
  surfaceAlt: '#2E3B34',
  text: '#F2EDE3',
  textMuted: '#A8B0A5',
  primary: '#F2920A',
  jungle: '#5BAF7A',
  jungleDeep: '#173F28',
  river: '#5AA2C0',
  gold: '#E8B825',
  locked: '#4A554E',
  border: '#3A473F',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };
