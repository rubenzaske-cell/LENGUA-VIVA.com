// Contenido lingüístico y cultural de Lengua Viva.
//
// El contenido está organizado como un CURRÍCULO REAL por lecciones temáticas
// (un módulo introductorio pensado para ~3 meses de estudio). Cada lección
// enseña un grupo de palabras y culmina en una LECCIÓN DE DIÁLOGO: dos
// personajes conversan usando exactamente esas palabras, para que la persona
// que aprende vea cómo se usan en la vida real.
//
// IMPORTANTE: El vocabulario y los diálogos usan formas de alta frecuencia y
// ampliamente documentadas. Aun así, antes de una publicación oficial todo el
// contenido debe validarse con lingüistas y hablantes nativos (DIGEIBIRA,
// universidades, organizaciones indígenas), como indica la especificación del
// producto. El quechua sigue la variante Cusco-Collao.

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

// Un personaje que participa en un diálogo.
export interface Speaker {
  name: string;
  emoji: string; // avatar
}

// Una línea del diálogo, dicha por el personaje A o B.
export interface DialogueLine {
  speaker: 'a' | 'b';
  text: string; // la frase en la lengua originaria
  es: string; // su traducción al español
}

// Una conversación de la vida real que reutiliza el vocabulario de la lección.
export interface Dialogue {
  title: string; // título de la escena
  setting: string; // breve contexto en español
  a: Speaker;
  b: Speaker;
  lines: DialogueLine[];
}

export interface Lesson {
  title: string; // tema de la lección (en español)
  native?: string; // título en la lengua originaria (opcional)
  vocab: VocabItem[];
  dialogue: Dialogue;
  culture?: CultureCapsule; // algunas lecciones incluyen una cápsula cultural
}

export interface LanguageDef {
  id: string;
  name: string;
  family: FamilyId;
  featured?: boolean;
  available: boolean; // con contenido en este prototipo
  lessons: Lesson[];
  vocab: VocabItem[]; // banco completo (se arma solo a partir de las lecciones)
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

// ---------------------------------------------------------------------------
// QUECHUA (Cusco-Collao) — 12 lecciones
// Personajes recurrentes: Tupaq (👦🏽) y Sisa (👧🏽), dos amigos del Cusco.
// ---------------------------------------------------------------------------
const TUPAQ: Speaker = { name: 'Tupaq', emoji: '👦🏽' };
const SISA: Speaker = { name: 'Sisa', emoji: '👧🏽' };

const QUECHUA_LESSONS: Lesson[] = [
  {
    title: 'Saludos',
    native: 'Napaykuykuna',
    vocab: [
      { word: 'rimaykullayki', es: 'hola (te saludo)', emoji: '👋' },
      { word: 'allillanchu', es: '¿estás bien?', emoji: '🙂' },
      { word: 'allillanmi', es: 'estoy bien', emoji: '👍' },
      { word: 'añay', es: 'gracias', emoji: '🙏' },
      { word: 'arí', es: 'sí', emoji: '✅' },
      { word: 'mana', es: 'no', emoji: '🙅' },
    ],
    dialogue: {
      title: 'Un encuentro',
      setting: 'Tupaq y Sisa se encuentran en la plaza del pueblo.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: '¡Rimaykullayki, Sisa!', es: '¡Hola, Sisa!' },
        { speaker: 'b', text: '¡Rimaykullayki, Tupaq!', es: '¡Hola, Tupaq!' },
        { speaker: 'a', text: 'Allillanchu?', es: '¿Estás bien?' },
        { speaker: 'b', text: 'Allillanmi, añay. Qanrí?', es: 'Estoy bien, gracias. ¿Y tú?' },
        { speaker: 'a', text: 'Ñoqapas allillanmi.', es: 'Yo también estoy bien.' },
      ],
    },
  },
  {
    title: '¿Cómo te llamas?',
    native: 'Ima sutiyki?',
    vocab: [
      { word: 'ima', es: 'qué', emoji: '❓' },
      { word: 'suti', es: 'nombre', emoji: '🏷️' },
      { word: 'ñoqa', es: 'yo', emoji: '🙋' },
      { word: 'qan', es: 'tú', emoji: '👉' },
      { word: 'maymanta', es: 'de dónde', emoji: '🧭' },
      { word: 'llaqta', es: 'pueblo', emoji: '🏘️' },
    ],
    dialogue: {
      title: 'Conociéndonos',
      setting: 'Tupaq conoce a una nueva amiga y le pregunta su nombre.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: 'Ima sutiyki?', es: '¿Cómo te llamas?' },
        { speaker: 'b', text: 'Ñoqaq sutiyqa Sisa. Qanrí?', es: 'Mi nombre es Sisa. ¿Y tú?' },
        { speaker: 'a', text: 'Ñoqaqa Tupaqmi kani.', es: 'Yo soy Tupaq.' },
        { speaker: 'b', text: 'Maymanta kanki?', es: '¿De dónde eres?' },
        { speaker: 'a', text: 'Ñoqa Qosqo llaqtamanta kani.', es: 'Soy del pueblo de Cusco.' },
      ],
    },
  },
  {
    title: 'La familia',
    native: 'Ayllu',
    vocab: [
      { word: 'ayllu', es: 'familia', emoji: '👨‍👩‍👧‍👦' },
      { word: 'mama', es: 'mamá', emoji: '👩' },
      { word: 'tayta', es: 'papá', emoji: '👨' },
      { word: 'wawa', es: 'bebé / hijo', emoji: '👶' },
      { word: 'ñaña', es: 'hermana (de una mujer)', emoji: '👧' },
      { word: 'wawqe', es: 'hermano (de un hombre)', emoji: '👦' },
    ],
    dialogue: {
      title: 'Mi familia',
      setting: 'Sisa le presenta su familia a Tupaq con una foto.',
      a: SISA,
      b: TUPAQ,
      lines: [
        { speaker: 'a', text: 'Kaymi ñoqaq ayllUY.', es: 'Esta es mi familia.' },
        { speaker: 'b', text: 'Pin kay warmi?', es: '¿Quién es esta mujer?' },
        { speaker: 'a', text: 'Paymi ñoqaq mamay.', es: 'Ella es mi mamá.' },
        { speaker: 'b', text: 'Kay wawari?', es: '¿Y este bebé?' },
        { speaker: 'a', text: 'Paymi ñoqaq wawqey.', es: 'Él es mi hermano.' },
        { speaker: 'b', text: 'Munay ayllu!', es: '¡Linda familia!' },
      ],
    },
  },
  {
    title: 'Los números (1 al 5)',
    native: 'Yupaykuna 1–5',
    vocab: [
      { word: 'huk', es: 'uno', emoji: '1️⃣' },
      { word: 'iskay', es: 'dos', emoji: '2️⃣' },
      { word: 'kimsa', es: 'tres', emoji: '3️⃣' },
      { word: 'tawa', es: 'cuatro', emoji: '4️⃣' },
      { word: 'pichqa', es: 'cinco', emoji: '5️⃣' },
      { word: "hayk'a", es: 'cuánto', emoji: '🔢' },
    ],
    dialogue: {
      title: 'Contando en el mercado',
      setting: 'Tupaq y Sisa cuentan sus animales antes de la feria.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: "Hayk'a llamayki kan?", es: '¿Cuántas llamas tienes?' },
        { speaker: 'b', text: 'Kimsa llamay kan.', es: 'Tengo tres llamas.' },
        { speaker: 'a', text: 'Ñoqaqpas pichqa uwihay kan.', es: 'Yo tengo cinco ovejas.' },
        { speaker: 'b', text: 'Huk, iskay, kimsa, tawa, pichqa... allinmi!', es: 'Uno, dos, tres, cuatro, cinco... ¡bien!' },
      ],
    },
    culture: {
      title: 'La yupana: contar con los dedos y con piedras',
      body:
        'En los Andes se contaba con la yupana (un tablero de conteo) y se registraba en los quipus, cuerdas con nudos. El quechua tiene un sistema decimal muy claro: por eso, aprender del 1 al 10 abre la puerta a contar hasta el infinito. ¡Chunka (10) chunka = 100!',
    },
  },
  {
    title: 'Los números (6 al 10)',
    native: 'Yupaykuna 6–10',
    vocab: [
      { word: 'suqta', es: 'seis', emoji: '6️⃣' },
      { word: 'qanchis', es: 'siete', emoji: '7️⃣' },
      { word: 'pusaq', es: 'ocho', emoji: '8️⃣' },
      { word: 'isqun', es: 'nueve', emoji: '9️⃣' },
      { word: 'chunka', es: 'diez', emoji: '🔟' },
      { word: 'yupay', es: 'contar', emoji: '➕' },
    ],
    dialogue: {
      title: 'Las estrellas de la noche',
      setting: 'Al anochecer, Sisa enseña a Tupaq a contar estrellas.',
      a: SISA,
      b: TUPAQ,
      lines: [
        { speaker: 'a', text: 'Ch’askakunata yupasunchis.', es: 'Contemos las estrellas.' },
        { speaker: 'b', text: 'Suqta, qanchis, pusaq...', es: 'Seis, siete, ocho...' },
        { speaker: 'a', text: 'Isqun, chunka!', es: '¡Nueve, diez!' },
        { speaker: 'b', text: 'Chunka ch’aska! Sumaqmi.', es: '¡Diez estrellas! Qué hermoso.' },
      ],
    },
  },
  {
    title: 'Los animales',
    native: 'Uywakuna',
    vocab: [
      { word: 'allqu', es: 'perro', emoji: '🐕' },
      { word: 'misi', es: 'gato', emoji: '🐈' },
      { word: 'wallpa', es: 'gallina', emoji: '🐔' },
      { word: 'uwiha', es: 'oveja', emoji: '🐑' },
      { word: 'llama', es: 'llama', emoji: '🦙' },
      { word: 'kuntur', es: 'cóndor', emoji: '🦅' },
    ],
    dialogue: {
      title: 'En el cerro',
      setting: 'Tupaq y Sisa pastan a los animales y ven un cóndor.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: 'Llamaykuna hina uwihaykuna mikhunku.', es: 'Las llamas y las ovejas están comiendo.' },
        { speaker: 'b', text: 'Allquyki uywata qhawan.', es: 'Tu perro cuida a los animales.' },
        { speaker: 'a', text: 'Qhaway! Hanaqpi huk kuntur!', es: '¡Mira! ¡Arriba un cóndor!' },
        { speaker: 'b', text: 'Kunturqa Apuq willaqnin.', es: 'El cóndor es el mensajero de los Apus.' },
      ],
    },
    culture: {
      title: 'El cóndor, mensajero de los Andes',
      body:
        'El cóndor (kuntur) es el ave voladora más grande del mundo y un ser sagrado en los Andes. Se le considera mensajero entre el Hanan Pacha (el mundo de arriba) y el Kay Pacha (el mundo de aquí). Verlo volar sobre las montañas se siente como una bendición de los Apus, los espíritus de los cerros.',
    },
  },
  {
    title: 'Los colores',
    native: 'Llimphikuna',
    vocab: [
      { word: 'puka', es: 'rojo', emoji: '🔴' },
      { word: "q'omer", es: 'verde', emoji: '🟢' },
      { word: "q'ellu", es: 'amarillo', emoji: '🟡' },
      { word: 'yana', es: 'negro', emoji: '⚫' },
      { word: 'yuraq', es: 'blanco', emoji: '⚪' },
      { word: 'anqas', es: 'azul', emoji: '🔵' },
    ],
    dialogue: {
      title: 'Un tejido nuevo',
      setting: 'Sisa muestra la manta (lliklla) que tejió su mamá.',
      a: SISA,
      b: TUPAQ,
      lines: [
        { speaker: 'a', text: 'Kay llikllaqa puka, q’ellu, anqas.', es: 'Esta manta es roja, amarilla, azul.' },
        { speaker: 'b', text: 'Sumaqmi! Q’omerpas kan.', es: '¡Qué bonita! También tiene verde.' },
        { speaker: 'a', text: 'Arí, yana yuraqwan.', es: 'Sí, con negro y blanco.' },
        { speaker: 'b', text: 'Llapan llimphi kaypi kashan!', es: '¡Todos los colores están aquí!' },
      ],
    },
  },
  {
    title: 'La comida',
    native: 'Mikhuna',
    vocab: [
      { word: 'papa', es: 'papa', emoji: '🥔' },
      { word: 'sara', es: 'maíz', emoji: '🌽' },
      { word: 'aycha', es: 'carne', emoji: '🍖' },
      { word: "t'anta", es: 'pan', emoji: '🍞' },
      { word: 'unu', es: 'agua', emoji: '💧' },
      { word: 'aqha', es: 'chicha', emoji: '🍺' },
    ],
    dialogue: {
      title: 'El almuerzo',
      setting: 'La familia se sienta a compartir el almuerzo del mediodía.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: 'Yarqawashanmi. Ima mikhuna kan?', es: 'Tengo hambre. ¿Qué comida hay?' },
        { speaker: 'b', text: 'Papa, sara, aychawan.', es: 'Papa, maíz y carne.' },
        { speaker: 'a', text: 'Añay! Unuta munani.', es: '¡Gracias! Quiero agua.' },
        { speaker: 'b', text: 'Kayqa unu, taytaykuqa aqhata upyan.', es: 'Aquí está el agua; tu papá toma chicha.' },
      ],
    },
    culture: {
      title: 'La papa: un tesoro de los Andes',
      body:
        'El Perú es cuna de la papa: existen más de 3000 variedades nativas. En los Andes se inventó el chuño, papa deshidratada por el hielo de la noche y el sol del día, que puede guardarse por años. La papa alimentó al Tahuantinsuyo y hoy alimenta al mundo entero.',
    },
  },
  {
    title: 'La naturaleza',
    native: 'Pacha',
    vocab: [
      { word: 'inti', es: 'sol', emoji: '☀️' },
      { word: 'killa', es: 'luna', emoji: '🌙' },
      { word: "ch'aska", es: 'estrella', emoji: '⭐' },
      { word: 'mayu', es: 'río', emoji: '🏞️' },
      { word: 'urqu', es: 'cerro / montaña', emoji: '⛰️' },
      { word: 'qocha', es: 'lago', emoji: '🌊' },
    ],
    dialogue: {
      title: 'Al atardecer',
      setting: 'Tupaq y Sisa contemplan el paisaje mientras cae la tarde.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: 'Intiqa urqu qhipaman ripushan.', es: 'El sol se está yendo tras el cerro.' },
        { speaker: 'b', text: 'Killawan ch’askakuna hamunku.', es: 'Vienen la luna y las estrellas.' },
        { speaker: 'a', text: 'Mayuqa qochaman purishan.', es: 'El río camina hacia el lago.' },
        { speaker: 'b', text: 'Pachaqa sumaqmi.', es: 'La naturaleza es hermosa.' },
      ],
    },
  },
  {
    title: 'El cuerpo',
    native: 'Ukhu',
    vocab: [
      { word: 'uma', es: 'cabeza', emoji: '🗣️' },
      { word: 'ñawi', es: 'ojo', emoji: '👁️' },
      { word: 'simi', es: 'boca', emoji: '👄' },
      { word: 'maki', es: 'mano', emoji: '✋' },
      { word: 'chaki', es: 'pie', emoji: '🦶' },
      { word: 'sonqo', es: 'corazón', emoji: '❤️' },
    ],
    dialogue: {
      title: 'Enseñando a la wawa',
      setting: 'Sisa le enseña las partes del cuerpo a su hermanito.',
      a: SISA,
      b: TUPAQ,
      lines: [
        { speaker: 'a', text: 'Kayqa uma, kayqa ñawi.', es: 'Esto es la cabeza, esto es el ojo.' },
        { speaker: 'b', text: 'Simiywan rimani.', es: 'Con mi boca hablo.' },
        { speaker: 'a', text: 'Makiywan llank’ani, chakiywan purini.', es: 'Con mi mano trabajo, con mi pie camino.' },
        { speaker: 'b', text: 'Sonqoyqa kusisqa!', es: '¡Mi corazón está feliz!' },
      ],
    },
  },
  {
    title: 'Las acciones',
    native: 'Ruwaykuna',
    vocab: [
      { word: 'mikhuy', es: 'comer', emoji: '🍽️' },
      { word: 'upyay', es: 'beber', emoji: '🥤' },
      { word: 'puriy', es: 'caminar', emoji: '🚶' },
      { word: 'rimay', es: 'hablar', emoji: '🗣️' },
      { word: 'puñuy', es: 'dormir', emoji: '😴' },
      { word: "llank'ay", es: 'trabajar', emoji: '👷' },
    ],
    dialogue: {
      title: 'Un día de trabajo',
      setting: 'Tupaq cuenta lo que hace cada día en la chacra.',
      a: TUPAQ,
      b: SISA,
      lines: [
        { speaker: 'a', text: 'Sapa p’unchay chakraman purini.', es: 'Cada día camino a la chacra.' },
        { speaker: 'b', text: 'Chaypi llank’ankichu?', es: '¿Trabajas allí?' },
        { speaker: 'a', text: 'Arí, llank’ani, chaymanta mikhuni.', es: 'Sí, trabajo y luego como.' },
        { speaker: 'b', text: 'Tutaqa puñunki, allinmi.', es: 'De noche duermes, está bien.' },
      ],
    },
  },
  {
    title: 'Despedidas',
    native: 'Kacharpari',
    vocab: [
      { word: "allin p'unchay", es: 'buen día', emoji: '🌅' },
      { word: 'allin tuta', es: 'buenas noches', emoji: '🌃' },
      { word: 'tupananchiskama', es: 'hasta pronto', emoji: '👋' },
      { word: 'paqarinkama', es: 'hasta mañana', emoji: '🌄' },
      { word: 'añay', es: 'gracias', emoji: '🙏' },
      { word: 'kusikuni', es: 'me alegro', emoji: '😊' },
    ],
    dialogue: {
      title: 'Hasta mañana',
      setting: 'Termina un buen día y los amigos se despiden.',
      a: SISA,
      b: TUPAQ,
      lines: [
        { speaker: 'a', text: 'Sumaq p’unchay karqan. Añay!', es: 'Fue un buen día. ¡Gracias!' },
        { speaker: 'b', text: 'Ñoqapas kusikuni.', es: 'Yo también me alegro.' },
        { speaker: 'a', text: 'Tupananchiskama, paqarinkama!', es: '¡Hasta pronto, hasta mañana!' },
        { speaker: 'b', text: 'Allin tuta, Sisa!', es: '¡Buenas noches, Sisa!' },
      ],
    },
    culture: {
      title: 'Runasimi: la lengua del pueblo, viva hoy',
      body:
        'El quechua se llama a sí mismo runasimi, “la boca del pueblo”. Es la lengua originaria más hablada de América: millones de personas la usan cada día en Perú, Bolivia, Ecuador, Argentina, Chile y Colombia. Hablar quechua es mantener viva una manera milenaria de ver el mundo. ¡Yupaychasqa kachun runasiminchis!',
    },
  },
];

// ---------------------------------------------------------------------------
// SHIPIBO-KONIBO — 8 lecciones
// Personajes: Yaku, el bufeo (🐬) y Rama, una niña shipiba (👧🏽).
// Nota: los diálogos usan estructuras simples y de alta frecuencia; el shipibo
// es una lengua Pano con gramática propia y debe revisarse con hablantes.
// ---------------------------------------------------------------------------
const YAKU: Speaker = { name: 'Yaku', emoji: '🐬' };
const RAMA: Speaker = { name: 'Rama', emoji: '👧🏽' };

const SHIPIBO_LESSONS: Lesson[] = [
  {
    title: 'Saludos',
    native: 'Jakon nete',
    vocab: [
      { word: 'jakon', es: 'bueno / bonito', emoji: '👍' },
      { word: 'nete', es: 'día', emoji: '☀️' },
      { word: 'jakon nete', es: 'buen día', emoji: '🌅' },
    ],
    dialogue: {
      title: 'Buen día en la comunidad',
      setting: 'Yaku saluda a Rama a la orilla del río.',
      a: YAKU,
      b: RAMA,
      lines: [
        { speaker: 'a', text: '¡Jakon nete, Rama!', es: '¡Buen día, Rama!' },
        { speaker: 'b', text: '¡Jakon nete, Yaku!', es: '¡Buen día, Yaku!' },
        { speaker: 'a', text: 'Jakon nete iki.', es: 'Es un buen día.' },
        { speaker: 'b', text: 'Jakon, jakon.', es: 'Bueno, bueno.' },
      ],
    },
  },
  {
    title: 'La familia',
    native: 'Xobo joni',
    vocab: [
      { word: 'tita', es: 'mamá', emoji: '👩' },
      { word: 'papa', es: 'papá', emoji: '👨' },
      { word: 'bake', es: 'niño / hijo', emoji: '🧒' },
    ],
    dialogue: {
      title: 'Mi familia',
      setting: 'Rama le presenta su familia a Yaku.',
      a: RAMA,
      b: YAKU,
      lines: [
        { speaker: 'a', text: 'Nato ea tita.', es: 'Esta es mi mamá.' },
        { speaker: 'b', text: 'Nato papa iki?', es: '¿Este es tu papá?' },
        { speaker: 'a', text: 'Jakon papa iki.', es: 'Es un buen papá.' },
        { speaker: 'b', text: 'Nato bake jakon.', es: 'Este niño es bueno.' },
      ],
    },
  },
  {
    title: 'El agua y el cielo',
    native: 'Jene, bari',
    vocab: [
      { word: 'paro', es: 'río', emoji: '🏞️' },
      { word: 'jene', es: 'agua', emoji: '💧' },
      { word: 'bari', es: 'sol', emoji: '🌞' },
    ],
    dialogue: {
      title: 'A la orilla del río',
      setting: 'Yaku y Rama miran el río bajo el sol.',
      a: YAKU,
      b: RAMA,
      lines: [
        { speaker: 'a', text: 'Nato paro jakon iki.', es: 'Este río es bonito.' },
        { speaker: 'b', text: 'Jene jakon iki.', es: 'El agua está buena.' },
        { speaker: 'a', text: 'Bari jakon iki.', es: 'El sol está bueno.' },
        { speaker: 'b', text: '¡Jakon nete!', es: '¡Buen día!' },
      ],
    },
    culture: {
      title: 'El bufeo colorado, señor de los ríos',
      body:
        'El bufeo colorado o delfín rosado (como Yaku) habita los ríos amazónicos. En muchos relatos shipibo-konibo es un ser poderoso y misterioso que cuida las aguas. Hoy es también un símbolo de la salud de los ríos: donde vive el bufeo, el río está vivo.',
    },
  },
  {
    title: 'La comunidad',
    native: 'Jema',
    vocab: [
      { word: 'oxe', es: 'luna', emoji: '🌙' },
      { word: 'jema', es: 'comunidad', emoji: '🏘️' },
      { word: 'xobo', es: 'casa', emoji: '🏠' },
    ],
    dialogue: {
      title: 'De regreso a casa',
      setting: 'Al caer la noche, Rama vuelve a su casa en la comunidad.',
      a: RAMA,
      b: YAKU,
      lines: [
        { speaker: 'a', text: 'Nato ea xobo iki.', es: 'Esta es mi casa.' },
        { speaker: 'b', text: 'Jakon jema iki.', es: 'Es una buena comunidad.' },
        { speaker: 'a', text: 'Oxe jakon iki.', es: 'La luna está bonita.' },
        { speaker: 'b', text: '¡Jakon nete kaya!', es: '¡Que sea un buen día!' },
      ],
    },
  },
  {
    title: 'Animales del bosque',
    native: 'Ni yoina',
    vocab: [
      { word: 'ronin', es: 'anaconda', emoji: '🐍' },
      { word: 'ino', es: 'jaguar', emoji: '🐆' },
      { word: 'bawa', es: 'guacamayo', emoji: '🦜' },
    ],
    dialogue: {
      title: 'Los guardianes',
      setting: 'Yaku le cuenta a Rama sobre los animales del bosque.',
      a: YAKU,
      b: RAMA,
      lines: [
        { speaker: 'a', text: 'Nato ronin iki.', es: 'Esta es la anaconda.' },
        { speaker: 'b', text: 'Ino jakon iki.', es: 'El jaguar es hermoso.' },
        { speaker: 'a', text: 'Bawa jakon iki.', es: 'El guacamayo es bonito.' },
        { speaker: 'b', text: 'Jakon yoina.', es: 'Buenos animales.' },
      ],
    },
    culture: {
      title: 'Animales sagrados de la Amazonía',
      body:
        'La anaconda (ronin) y el jaguar (ino) tienen un lugar especial en la cosmovisión shipibo-konibo: son guardianes de los mundos del agua y del bosque. En los cantos y en el arte kené aparecen sus caminos y su energía. Aprender sus nombres es también aprender a respetarlos.',
    },
  },
  {
    title: 'En el río y el bosque',
    native: 'Paro, ni',
    vocab: [
      { word: 'yapa', es: 'pez', emoji: '🐟' },
      { word: 'ni', es: 'bosque', emoji: '🌳' },
      { word: 'joa', es: 'flor', emoji: '🌺' },
    ],
    dialogue: {
      title: 'Un paseo',
      setting: 'Rama y Yaku pasean entre el río y el bosque.',
      a: RAMA,
      b: YAKU,
      lines: [
        { speaker: 'a', text: 'Paroa yapa iki.', es: 'En el río hay peces.' },
        { speaker: 'b', text: 'Ni jakon iki.', es: 'El bosque es hermoso.' },
        { speaker: 'a', text: 'Nato joa jakon iki.', es: 'Esta flor es bonita.' },
        { speaker: 'b', text: '¡Jakon paro, jakon ni!', es: '¡Buen río, buen bosque!' },
      ],
    },
  },
  {
    title: 'La comida y el arte',
    native: 'Piti, kené',
    vocab: [
      { word: 'atsa', es: 'yuca', emoji: '🥔' },
      { word: 'piti', es: 'comida', emoji: '🍲' },
      { word: 'kené', es: 'diseño (arte)', emoji: '🧵' },
    ],
    dialogue: {
      title: 'La comida de la casa',
      setting: 'Rama comparte su comida y le muestra a Yaku su arte kené.',
      a: RAMA,
      b: YAKU,
      lines: [
        { speaker: 'a', text: 'Nato atsa iki.', es: 'Esto es yuca.' },
        { speaker: 'b', text: 'Jakon piti iki.', es: 'Es buena comida.' },
        { speaker: 'a', text: 'Nato kené iki.', es: 'Este es el diseño kené.' },
        { speaker: 'b', text: '¡Jakon kené!', es: '¡Hermoso kené!' },
      ],
    },
    culture: {
      title: 'El kené, el arte de los caminos',
      body:
        'El kené es el arte de diseño del pueblo Shipibo-Konibo: patrones geométricos que representan los caminos de la energía, los ríos y los cantos (íkaros). Fue declarado Patrimonio Cultural de la Nación del Perú. Cada línea cuenta una historia; las mujeres las tejen, bordan y pintan de memoria.',
    },
  },
  {
    title: 'Objetos y naturaleza',
    native: 'Chomo, nonti',
    vocab: [
      { word: 'chomo', es: 'tinaja (vasija)', emoji: '🏺' },
      { word: 'nonti', es: 'canoa', emoji: '🛶' },
      { word: 'isá', es: 'ave', emoji: '🐦' },
    ],
    dialogue: {
      title: 'Rumbo al río',
      setting: 'Yaku y Rama alistan la canoa para navegar.',
      a: YAKU,
      b: RAMA,
      lines: [
        { speaker: 'a', text: 'Nato nonti iki.', es: 'Esta es la canoa.' },
        { speaker: 'b', text: 'Nato chomo jakon iki.', es: 'Esta tinaja es bonita.' },
        { speaker: 'a', text: 'Isá jakon iki.', es: 'El ave es hermosa.' },
        { speaker: 'b', text: '¡Jakon nete, Yaku!', es: '¡Buen día, Yaku!' },
      ],
    },
  },
];

// Arma el banco completo de palabras de una lengua a partir de sus lecciones
// (se usa como pozo de distractores en los ejercicios).
function flattenVocab(lessons: Lesson[]): VocabItem[] {
  const seen = new Set<string>();
  const all: VocabItem[] = [];
  for (const l of lessons) {
    for (const v of l.vocab) {
      if (!seen.has(v.word)) {
        seen.add(v.word);
        all.push(v);
      }
    }
  }
  return all;
}

// Lenguas sin contenido aún se muestran como "Próximamente".
const soon = (id: string, name: string, family: FamilyId): LanguageDef => ({
  id,
  name,
  family,
  available: false,
  lessons: [],
  vocab: [],
});

const shipibo: LanguageDef = {
  id: 'shipibo',
  name: 'Shipibo-Konibo',
  family: 'amazonia',
  featured: true,
  available: true,
  lessons: SHIPIBO_LESSONS,
  vocab: flattenVocab(SHIPIBO_LESSONS),
};

const quechua: LanguageDef = {
  id: 'quechua',
  name: 'Quechua (Cusco-Collao)',
  family: 'andes',
  featured: true,
  available: true,
  lessons: QUECHUA_LESSONS,
  vocab: flattenVocab(QUECHUA_LESSONS),
};

export const LANGUAGES: LanguageDef[] = [
  shipibo,
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
  quechua,
  soon('aimara', 'Aimara', 'andes'),
  soon('jaqaru', 'Jaqaru', 'andes'),
  soon('kawki', 'Kawki', 'andes'),
];

export function getLanguage(id: string): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

// Cantidad de niveles (lecciones) de una lengua.
export function totalLevels(lang: LanguageDef): number {
  return lang.lessons.length;
}

// La lección (nivel 1-indexado) de una lengua.
export function lessonForLevel(lang: LanguageDef, level: number): Lesson | undefined {
  return lang.lessons[level - 1];
}

export function vocabForLevel(lang: LanguageDef, level: number): VocabItem[] {
  return lessonForLevel(lang, level)?.vocab ?? [];
}

export function dialogueForLevel(lang: LanguageDef, level: number): Dialogue | undefined {
  return lessonForLevel(lang, level)?.dialogue;
}

export function cultureForLevel(lang: LanguageDef, level: number): CultureCapsule | undefined {
  return lessonForLevel(lang, level)?.culture;
}
