# 🐬 Lengua Viva

**Aprende las lenguas indígenas del Perú.**

Aplicación multiplataforma (Android, iOS y web) construida con [Expo / React Native](https://expo.dev), inspirada en la mecánica de Duolingo pero con una identidad propia: la **Escalera del Conocimiento**, una ruta de aprendizaje vertical ascendente hacia el saber ancestral.

## ✨ Funcionalidades (prototipo v1)

- **Splash animado** con Yaku, el delfín rosado amazónico.
- **Registro** con Google / Apple / correo (simulado en este prototipo) o modo invitado.
- **Onboarding narrativo** con diálogo letra por letra.
- **Encuesta de personalización**: edad, experiencia previa, meta diaria y motivación.
- **Selección de familia lingüística**: Amazonía (guía: Yaku 🐬) o Andes (guía: Cóndor bebé 🐥).
- **Currículo real (módulo introductorio ~3 meses)**: lecciones temáticas
  ordenadas. **Quechua (Cusco-Collao): 12 lecciones** (saludos, nombres,
  familia, números 1–10, animales, colores, comida, naturaleza, cuerpo,
  acciones y despedidas) y **Shipibo-Konibo: 8 lecciones**. Las demás lenguas
  aparecen como "Próximamente".
- **Escalera del Conocimiento**: ruta vertical con una lección por escalón,
  cada una con su tema, su conversación y, en varias, una cápsula cultural.
- **Ejercicios**: vocabulario nuevo, elegir traducción, elegir imagen,
  traducción inversa, ordenar palabras y relacionar columnas.
- **💬 Lección de diálogo (nuevo)**: al terminar de practicar, dos personajes
  (Tupaq y Sisa en los Andes; Yaku y Rama en la Amazonía) **conversan usando
  exactamente las palabras aprendidas**, con la traducción al lado y las
  palabras del vocabulario resaltadas. Así se ve cómo se usan en una
  conversación real. Puede leerse paso a paso o reproducirse solo.
- **IA adaptativa (regla básica)**: los ejercicios fallados se refuerzan al final de la lección.
- **Cápsulas culturales**: kené, el bufeo, animales sagrados, la yupana, el
  cóndor, la papa, el runasimi vivo, y más.
- **Gamificación**: XP, racha diaria, insignias.
- **Perfil** con estadísticas y progreso por lengua.
- **Configuración**: modo oscuro, sonidos, velocidad de audio, notificaciones.
- **Persistencia local** con AsyncStorage (el progreso sobrevive al cerrar la app).

## 🚀 Cómo ejecutar

```bash
npm install
npm run web      # en el navegador
npm run android  # en Android (requiere Expo Go o emulador)
npm run ios      # en iOS (requiere Expo Go o simulador)
```

### 🌐 Compilar la web (instalable en cualquier dispositivo)

```bash
npx expo export --platform web   # genera la carpeta dist/ lista para publicar
```

La misma base de código corre en **Android, iOS y web**. En la web:

- **Responsive**: en teléfonos y navegadores angostos ocupa toda la pantalla;
  en escritorio o tablet se encuadra en un marco tipo teléfono centrado
  (`src/components/ResponsiveShell.tsx`).
- **PWA instalable**: incluye `manifest.webmanifest`, `theme-color`,
  íconos y `apple-touch-icon` (carpeta `public/`), así que puede
  "Agregarse a la pantalla de inicio" en Android e iOS y abrirse a pantalla
  completa como una app nativa.

El contenido de `dist/` es estático y se puede subir a cualquier hosting
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).

## 📁 Estructura

```
App.tsx                  # raíz: navegación + proveedores
src/
  theme.ts               # paleta (tierra, selva, andes) claro/oscuro
  navigation.tsx         # router ligero por contexto
  state/store.tsx        # estado global + persistencia
  data/content.ts        # currículo: lecciones (vocabulario + diálogo +
                         # cápsula cultural) por lengua
  components/            # Mascotas, botones, DialogueView (lección de diálogo)
  screens/               # Splash, Auth, Onboarding, Encuesta, Familia,
                         # Escalera, Lección, Perfil, Configuración
```

Cada lección (`Lesson`) reúne su vocabulario, su **diálogo** (dos personajes,
`Dialogue`) y, cuando corresponde, una cápsula cultural. La Escalera del
Conocimiento recorre las lecciones en orden.

## ⚠️ Contenido lingüístico

El vocabulario y los diálogos usan **formas de alta frecuencia y ampliamente
documentadas** (el quechua sigue la variante Cusco-Collao). Aun así, antes de
una publicación oficial todo el contenido debe **validarse con lingüistas y
hablantes nativos** de las comunidades correspondientes (DIGEIBIRA,
universidades, organizaciones indígenas), como indica la especificación del
producto. En particular, los diálogos en shipibo-konibo se mantienen simples y
deben revisarse con hablantes de la lengua.

## 🗺️ Próximos pasos

- **Saludo con la cámara**: cuando la cámara detecte que el usuario saluda con la
  mano ("hola"), se activará la animación de Yaku saludando con la aleta
  (`assets/mascotas/yaku-saludo-sprites.png`, ya procesada y lista). Requiere
  detección de gestos de mano (p. ej. MediaPipe Hands en web / Vision en nativo).

- Arte final de Yaku y el Cóndor bebé (reemplazar placeholders).
- Audio nativo y ejercicios de pronunciación con micrófono.
- Autenticación real (OAuth Google/Apple) y sincronización en la nube.
- Modo offline con descarga de lecciones.
- Repetición espaciada (spaced repetition) y modelo adaptativo completo.
- Más lenguas: Asháninka, Awajún, Aimara, y el resto del catálogo.
