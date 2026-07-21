// Contenido lingüístico y cultural de Lengua Viva.
//
// IMPORTANTE: El vocabulario incluido es CONTENIDO DE EJEMPLO para el
// prototipo. Antes de publicar, todo el contenido debe validarse con
// lingüistas especializados y hablantes nativos (ver spec, sección 13.5 y 16).

export type FamilyId = 'amazonia' | 'andes';

export interface VocabItem {
  word: string; // palabra en la lengua originaria
  es: string; // traducción al español
  emoji: string; // imagen placeholder (se reemplazará por ilustraciones)
}

export interface CultureCapsule {
  title: string;
  body: string;
}

export interface LanguageDef {
  id: string;
  name: string;
  family: FamilyId;
  featured?: boolean;
  available: boolean; // con contenido en este prototipo
  vocab: VocabItem[];
  culture: CultureCapsule[];
}

export interface FamilyDef {
  id: FamilyId;
  name: string;
  subtitle: string;
  emoji: string;
  mascot: 'yaku' | 'condor';
}

export const FAMILIES: FamilyDef[] = [
  {
    id: 'amazonia',
    name: 'Amazonía',
    subtitle: 'Lenguas amazónicas',
    emoji: '🐬',
    mascot: 'yaku',
  },
  {
    id: 'andes',
    name: 'Andes',
    subtitle: 'Lenguas andinas',
    emoji: '🦅',
    mascot: 'condor',
  },
];

const SHIPIBO_VOCAB: VocabItem[] = [
  { word: 'jakon', es: 'bueno', emoji: '👍' },
  { word: 'nete', es: 'día', emoji: '☀️' },
  { word: 'jakon nete', es: 'buen día', emoji: '🌅' },
  { word: 'tita', es: 'madre', emoji: '👩' },
  { word: 'papa', es: 'padre', emoji: '👨' },
  { word: 'bake', es: 'niño', emoji: '🧒' },
  { word: 'paro', es: 'río', emoji: '🏞️' },
  { word: 'jene', es: 'agua', emoji: '💧' },
  { word: 'bari', es: 'sol', emoji: '🌞' },
  { word: 'oxe', es: 'luna', emoji: '🌙' },
  { word: 'jema', es: 'comunidad', emoji: '🏘️' },
  { word: 'xobo', es: 'casa', emoji: '🏠' },
  { word: 'ronin', es: 'anaconda', emoji: '🐍' },
  { word: 'ino', es: 'jaguar', emoji: '🐆' },
  { word: 'bawa', es: 'loro', emoji: '🦜' },
  { word: 'yapa', es: 'pez', emoji: '🐟' },
  { word: 'ni', es: 'bosque', emoji: '🌳' },
  { word: 'joa', es: 'flor', emoji: '🌺' },
  { word: 'atsa', es: 'yuca', emoji: '🥔' },
  { word: 'piti', es: 'comida', emoji: '🍲' },
  { word: 'kené', es: 'diseño', emoji: '🧵' },
  { word: 'chomo', es: 'tinaja', emoji: '🏺' },
  { word: 'nonti', es: 'canoa', emoji: '🛶' },
  { word: 'isá', es: 'ave', emoji: '🐦' },
];

const QUECHUA_VOCAB: VocabItem[] = [
  { word: 'allin p’unchay', es: 'buenos días', emoji: '🌅' },
  { word: 'rimaykullayki', es: 'te saludo', emoji: '👋' },
  { word: 'añay', es: 'gracias', emoji: '🙏' },
  { word: 'arí', es: 'sí', emoji: '✅' },
  { word: 'manan', es: 'no', emoji: '❌' },
  { word: 'mama', es: 'madre', emoji: '👩' },
  { word: 'tayta', es: 'padre', emoji: '👨' },
  { word: 'wawa', es: 'bebé', emoji: '👶' },
  { word: 'wasi', es: 'casa', emoji: '🏠' },
  { word: 'inti', es: 'sol', emoji: '🌞' },
  { word: 'killa', es: 'luna', emoji: '🌙' },
  { word: 'unu', es: 'agua', emoji: '💧' },
  { word: 'mayu', es: 'río', emoji: '🏞️' },
  { word: 'urqu', es: 'montaña', emoji: '⛰️' },
  { word: 'kuntur', es: 'cóndor', emoji: '🦅' },
  { word: 'puma', es: 'puma', emoji: '🐆' },
  { word: 'allqu', es: 'perro', emoji: '🐕' },
  { word: 'misi', es: 'gato', emoji: '🐈' },
  { word: 't’anta', es: 'pan', emoji: '🍞' },
  { word: 'sara', es: 'maíz', emoji: '🌽' },
  { word: 'papa', es: 'papa', emoji: '🥔' },
  { word: 'ñan', es: 'camino', emoji: '🛤️' },
  { word: 'llaqta', es: 'pueblo', emoji: '🏘️' },
  { word: 'sonqo', es: 'corazón', emoji: '❤️' },
];

const SHIPIBO_CULTURE: CultureCapsule[] = [
  {
    title: 'El significado del Kené',
    body:
      'El kené es el arte de diseño del pueblo Shipibo-Konibo: patrones geométricos que representan los caminos de la energía y la visión del mundo. Fue declarado Patrimonio Cultural de la Nación en el Perú. Cada línea cuenta una historia sobre los ríos, las plantas y los cantos.',
  },
  {
    title: 'La fiesta Ani Xeati',
    body:
      'El Ani Xeati era una gran celebración tradicional shipibo-konibo que reunía a las comunidades con cantos, danzas y bebidas como el masato. Era un espacio de encuentro, intercambio y transmisión de saberes entre generaciones.',
  },
  {
    title: 'El pueblo Shipibo-Konibo',
    body:
      'El pueblo Shipibo-Konibo vive principalmente a orillas del río Ucayali, en la Amazonía peruana. Su lengua pertenece a la familia Pano y es hablada por decenas de miles de personas. Su cerámica, textiles y cantos (íkaros) son reconocidos en todo el mundo.',
  },
  {
    title: 'El delfín rosado',
    body:
      'El bufeo colorado o delfín rosado habita los ríos amazónicos. En muchas tradiciones amazónicas es un ser poderoso y misterioso, protagonista de innumerables relatos. Hoy es también símbolo de la conservación de los ríos.',
  },
  {
    title: 'Animales sagrados de la Amazonía',
    body:
      'La anaconda (ronin), el jaguar (ino) y las aves tienen un lugar especial en la cosmovisión amazónica: son guardianes de los mundos del agua, del bosque y del aire. Aprender sus nombres es también aprender a respetarlos.',
  },
];

const QUECHUA_CULTURE: CultureCapsule[] = [
  {
    title: 'La Pachamama',
    body:
      'La Pachamama, o Madre Tierra, es el centro de la cosmovisión andina. Se le agradece con ofrendas y ceremonias, especialmente en agosto. Cuidar la tierra es cuidar la vida: ese es uno de los grandes valores del mundo andino.',
  },
  {
    title: 'El Inti Raymi',
    body:
      'El Inti Raymi, la Fiesta del Sol, era la celebración más importante del Tahuantinsuyo. Cada 24 de junio se recrea en Cusco: música, danzas y ofrendas agradecen al sol (Inti) por las cosechas.',
  },
  {
    title: 'El quechua hoy',
    body:
      'El quechua (runasimi) es la lengua originaria más hablada de América: millones de personas la usan cada día en Perú, Bolivia, Ecuador y otros países. Tiene variantes regionales como la Cusco-Collao y la Ayacucho-Chanka.',
  },
  {
    title: 'El cóndor andino',
    body:
      'El cóndor (kuntur) es el ave voladora más grande del mundo y un símbolo sagrado de los Andes: mensajero entre el mundo de arriba (Hanan Pacha) y el mundo de aquí (Kay Pacha).',
  },
  {
    title: 'Los textiles andinos',
    body:
      'Tejer es escribir con hilos: los textiles andinos guardan símbolos, historias y la identidad de cada comunidad. Cada color y figura tiene significado, transmitido de generación en generación.',
  },
];

// Lenguas sin contenido aún se muestran como "Próximamente".
const soon = (id: string, name: string, family: FamilyId): LanguageDef => ({
  id,
  name,
  family,
  available: false,
  vocab: [],
  culture: [],
});

export const LANGUAGES: LanguageDef[] = [
  {
    id: 'shipibo',
    name: 'Shipibo-Konibo',
    family: 'amazonia',
    featured: true,
    available: true,
    vocab: SHIPIBO_VOCAB,
    culture: SHIPIBO_CULTURE,
  },
  soon('ashaninka', 'Asháninka', 'amazonia'),
  soon('awajun', 'Awajún', 'amazonia'),
  soon('yine', 'Yine', 'amazonia'),
  soon('matsigenka', 'Matsigenka', 'amazonia'),
  soon('kakataibo', 'Kakataibo', 'amazonia'),
  soon('bora', 'Bora', 'amazonia'),
  soon('murui', 'Murui', 'amazonia'),
  soon('eseeja', 'Ese Eja', 'amazonia'),
  soon('urarina', 'Urarina', 'amazonia'),
  soon('maijuna', 'Maijuna', 'amazonia'),
  soon('kukama', 'Kukama', 'amazonia'),
  {
    id: 'quechua',
    name: 'Quechua (Cusco-Collao)',
    family: 'andes',
    featured: true,
    available: true,
    vocab: QUECHUA_VOCAB,
    culture: QUECHUA_CULTURE,
  },
  soon('aimara', 'Aimara', 'andes'),
  soon('jaqaru', 'Jaqaru', 'andes'),
  soon('kawki', 'Kawki', 'andes'),
];

export const TOTAL_LEVELS = 20;
export const WORDS_PER_LEVEL = 4;
export const CULTURE_EVERY = 4; // cápsula cultural cada 4 niveles

export function getLanguage(id: string): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

// Vocabulario asignado a un nivel (1-indexado), ciclando el banco de palabras.
export function vocabForLevel(lang: LanguageDef, level: number): VocabItem[] {
  const start = ((level - 1) * WORDS_PER_LEVEL) % lang.vocab.length;
  const items: VocabItem[] = [];
  for (let i = 0; i < WORDS_PER_LEVEL; i++) {
    items.push(lang.vocab[(start + i) % lang.vocab.length]);
  }
  return items;
}

export function cultureForLevel(
  lang: LanguageDef,
  level: number
): CultureCapsule | undefined {
  if (level % CULTURE_EVERY !== 0 || lang.culture.length === 0) return undefined;
  return lang.culture[(level / CULTURE_EVERY - 1) % lang.culture.length];
}
