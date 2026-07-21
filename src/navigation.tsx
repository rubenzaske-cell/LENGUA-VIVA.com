import React, { createContext, useContext } from 'react';

export type Route =
  | { name: 'splash' }
  | { name: 'auth' }
  | { name: 'onboarding' }
  | { name: 'survey' }
  | { name: 'family' }
  | { name: 'ladder' }
  | { name: 'lesson'; level: number }
  | { name: 'profile' }
  | { name: 'settings' }
  | { name: 'saludo' };

export interface Navigation {
  route: Route;
  go: (route: Route) => void;
}

export const NavigationContext = createContext<Navigation>({
  route: { name: 'splash' },
  go: () => {},
});

export function useNavigation(): Navigation {
  return useContext(NavigationContext);
}
