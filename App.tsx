import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContext, Route } from './src/navigation';
import { AppStateProvider, useAppState } from './src/state/store';
import { SaludoProvider } from './src/components/SaludoContext';
import YakuFlotante from './src/components/YakuFlotante';
import { darkTheme, lightTheme } from './src/theme';
import ResponsiveShell from './src/components/ResponsiveShell';
import AuthScreen from './src/screens/AuthScreen';
import FamilyScreen from './src/screens/FamilyScreen';
import LadderScreen from './src/screens/LadderScreen';
import LessonScreen from './src/screens/LessonScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import SurveyScreen from './src/screens/SurveyScreen';

function Root() {
  const state = useAppState();
  const [route, setRoute] = useState<Route>({ name: 'splash' });
  const theme = state.settings.darkMode ? darkTheme : lightTheme;

  // Al restaurar una sesión existente, saltar directo a la escalera.
  useEffect(() => {
    if (state.hydrated && state.languageId && route.name === 'splash') {
      setRoute({ name: 'ladder' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated]);

  if (!state.hydrated) {
    return <View style={{ flex: 1, backgroundColor: lightTheme.jungleDeep }} />;
  }

  const render = () => {
    switch (route.name) {
      case 'splash':
        return <SplashScreen theme={theme} />;
      case 'auth':
        return <AuthScreen theme={theme} />;
      case 'onboarding':
        return <OnboardingScreen theme={theme} />;
      case 'survey':
        return <SurveyScreen theme={theme} />;
      case 'family':
        return <FamilyScreen theme={theme} />;
      case 'ladder':
        return <LadderScreen theme={theme} />;
      case 'lesson':
        return <LessonScreen theme={theme} level={route.level} />;
      case 'profile':
        return <ProfileScreen theme={theme} />;
      case 'settings':
        return <SettingsScreen theme={theme} />;
    }
  };

  return (
    <SaludoProvider enabled={state.settings.cameraSaludo !== false}>
      <NavigationContext.Provider value={{ route, go: setRoute }}>
        <ResponsiveShell theme={theme}>
          {render()}
          {/* Yaku flotante que responde al saludo en todas las pantallas.
              En la bienvenida ya hay un Yaku grande, y en la lección se omite
              para no tapar las respuestas (ahí Yaku aparece en el diálogo). */}
          {route.name !== 'splash' && route.name !== 'lesson' && (
            <YakuFlotante theme={theme} />
          )}
          <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
        </ResponsiveShell>
      </NavigationContext.Provider>
    </SaludoProvider>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Root />
    </AppStateProvider>
  );
}
