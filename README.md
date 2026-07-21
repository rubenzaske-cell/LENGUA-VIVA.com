# 🐬 Lengua Viva

**Aprende las lenguas indígenas del Perú.**

Aplicación multiplataforma (Android, iOS y web) construida con [Expo / React Native](https://expo.dev), inspirada en la mecánica de Duolingo pero con una identidad propia: la **Escalera del Conocimiento**, una ruta de aprendizaje vertical ascendente hacia el saber ancestral.

## ✨ Funcionalidades (prototipo v1)

- **Splash animado** con Yaku, el delfín rosado amazónico.
- **Registro** con Google / Apple / correo (simulado en este prototipo) o modo invitado.
- **Onboarding narrativo** con diálogo letra por letra.
- **Encuesta de personalización**: edad, experiencia previa, meta diaria y motivación.
- **Selección de familia lingüística**: Amazonía (guía: Yaku 🐬) o Andes (guía: Cóndor bebé 🐥).
- **Lenguas con contenido**: Shipibo-Konibo y Quechua (Cusco-Collao). Las demás aparecen como "Próximamente".
- **Escalera del Conocimiento**: 20 niveles verticales, con niveles culturales cada 4 escalones.
- **Ejercicios**: vocabulario nuevo, elegir traducción, elegir imagen, traducción inversa, ordenar palabras y relacionar columnas.
- **IA adaptativa (regla básica)**: los ejercicios fallados se refuerzan al final de la lección.
- **Cápsulas culturales**: kené, Ani Xeati, Pachamama, Inti Raymi, y más.
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

## 📁 Estructura

```
App.tsx                  # raíz: navegación + proveedores
src/
  theme.ts               # paleta (tierra, selva, andes) claro/oscuro
  navigation.tsx         # router ligero por contexto
  state/store.tsx        # estado global + persistencia
  data/content.ts        # lenguas, vocabulario y cápsulas culturales
  components/            # Mascotas, botones, barras de progreso
  screens/               # Splash, Auth, Onboarding, Encuesta, Familia,
                         # Escalera, Lección, Perfil, Configuración
```

## ⚠️ Contenido lingüístico

El vocabulario incluido es **contenido de ejemplo para el prototipo**. Antes de cualquier publicación debe ser validado con lingüistas especializados y hablantes nativos de las comunidades correspondientes (DIGEIBIRA, universidades, organizaciones indígenas), como indica la especificación del producto.

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
