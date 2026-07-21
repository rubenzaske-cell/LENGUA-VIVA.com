import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card } from '../components/UI';
import { useNavigation } from '../navigation';
import { useAppDispatch, useAppState } from '../state/store';
import { spacing, Theme } from '../theme';

export default function SettingsScreen({ theme }: { theme: Theme }) {
  const { go } = useNavigation();
  const dispatch = useAppDispatch();
  const { settings } = useAppState();

  const Row = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <Card theme={theme} style={styles.row}>
      <Text style={{ fontSize: 16, color: theme.text, flex: 1 }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.jungle, false: theme.locked }}
      />
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl * 1.5 }}>
        <Text style={[styles.title, { color: theme.text }]}>Configuración</Text>

        <Row
          label="🌙  Modo oscuro"
          value={settings.darkMode}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { darkMode: v } })}
        />
        <Row
          label="🔊  Sonidos"
          value={settings.sounds}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { sounds: v } })}
        />
        <Row
          label="🔔  Notificaciones y recordatorios"
          value={settings.notifications}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { notifications: v } })}
        />
        <Row
          label="📷  Saludar a Yaku con la cámara"
          value={settings.cameraSaludo !== false}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { cameraSaludo: v } })}
        />
        <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: -4, marginBottom: spacing.sm, paddingHorizontal: 4 }}>
          Usa la cámara frontal para que Yaku responda tu saludo. El video se
          analiza solo en tu dispositivo y nunca se guarda ni se envía. Requiere
          abrir la app por HTTPS o localhost.
        </Text>

        <Card theme={theme} style={styles.row}>
          <Text style={{ fontSize: 16, color: theme.text, flex: 1 }}>🐢  Velocidad de audio</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {[0.75, 1, 1.25].map((speed) => (
              <Pressable
                key={speed}
                onPress={() => dispatch({ type: 'SET_SETTINGS', settings: { audioSpeed: speed } })}
                style={[
                  styles.speed,
                  {
                    backgroundColor:
                      settings.audioSpeed === speed ? theme.primary : theme.surfaceAlt,
                  },
                ]}
              >
                <Text
                  style={{
                    color: settings.audioSpeed === speed ? '#FFF' : theme.text,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {speed}x
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card theme={theme} style={{ marginBottom: spacing.sm }}>
          <Text style={{ fontSize: 16, color: theme.text }}>📥  Descargas sin conexión</Text>
          <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
            Próximamente: descarga lecciones y audios para practicar sin internet.
          </Text>
        </Card>

        <View style={{ height: spacing.xl }} />
        <Button
          title="Reiniciar progreso"
          variant="ghost"
          theme={theme}
          onPress={() => {
            dispatch({ type: 'RESET' });
            go({ name: 'splash' });
          }}
        />
      </ScrollView>

      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={() => go({ name: 'ladder' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>🪜 Ruta</Text>
        </Pressable>
        <Pressable onPress={() => go({ name: 'profile' })}>
          <Text style={[styles.tab, { color: theme.textMuted }]}>👤 Perfil</Text>
        </Pressable>
        <Text style={[styles.tab, { color: theme.primary }]}>⚙️ Ajustes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  speed: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  tab: { fontSize: 15, fontWeight: '700' },
});
