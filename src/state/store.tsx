import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FamilyId } from '../data/content';

export interface SurveyAnswers {
  ageRange?: string;
  studiedBefore?: string;
  dailyGoal?: string; // '5' | '10' | '15' | '20'
  motivations: string[];
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  earnedAt: string; // ISO date
}

export interface LanguageProgress {
  level: number; // siguiente nivel a jugar (1-indexado)
  xp: number;
}

export interface Settings {
  darkMode: boolean;
  sounds: boolean;
  audioSpeed: number;
  notifications: boolean;
}

export interface AppState {
  hydrated: boolean;
  userName: string | null;
  authMethod: 'google' | 'apple' | 'email' | 'guest' | null;
  onboarded: boolean;
  survey: SurveyAnswers;
  family: FamilyId | null;
  languageId: string | null;
  progress: Record<string, LanguageProgress>;
  xp: number;
  streak: number;
  lastPracticeDay: string | null; // 'YYYY-MM-DD'
  minutesStudied: number;
  badges: Badge[];
  settings: Settings;
}

const initialState: AppState = {
  hydrated: false,
  userName: null,
  authMethod: null,
  onboarded: false,
  survey: { motivations: [] },
  family: null,
  languageId: null,
  progress: {},
  xp: 0,
  streak: 0,
  lastPracticeDay: null,
  minutesStudied: 0,
  badges: [],
  settings: { darkMode: false, sounds: true, audioSpeed: 1, notifications: true },
};

type Action =
  | { type: 'HYDRATE'; state: Partial<AppState> }
  | { type: 'SIGN_IN'; method: AppState['authMethod']; name: string }
  | { type: 'ONBOARDED' }
  | { type: 'SET_SURVEY'; survey: SurveyAnswers }
  | { type: 'SET_FAMILY'; family: FamilyId }
  | { type: 'SET_LANGUAGE'; languageId: string }
  | { type: 'COMPLETE_LEVEL'; languageId: string; level: number; xp: number; minutes: number }
  | { type: 'ADD_BADGE'; badge: Badge }
  | { type: 'SET_SETTINGS'; settings: Partial<Settings> }
  | { type: 'RESET' };

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.state, hydrated: true };
    case 'SIGN_IN':
      return { ...state, authMethod: action.method, userName: action.name };
    case 'ONBOARDED':
      return { ...state, onboarded: true };
    case 'SET_SURVEY':
      return { ...state, survey: action.survey };
    case 'SET_FAMILY':
      return { ...state, family: action.family };
    case 'SET_LANGUAGE': {
      const progress = { ...state.progress };
      if (!progress[action.languageId]) {
        progress[action.languageId] = { level: 1, xp: 0 };
      }
      return { ...state, languageId: action.languageId, progress };
    }
    case 'COMPLETE_LEVEL': {
      const prev = state.progress[action.languageId] ?? { level: 1, xp: 0 };
      const nextLevel = Math.max(prev.level, action.level + 1);
      const today = todayKey();
      let streak = state.streak;
      if (state.lastPracticeDay !== today) {
        streak = state.lastPracticeDay === yesterdayKey() ? streak + 1 : 1;
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.languageId]: { level: nextLevel, xp: prev.xp + action.xp },
        },
        xp: state.xp + action.xp,
        streak,
        lastPracticeDay: today,
        minutesStudied: state.minutesStudied + action.minutes,
      };
    }
    case 'ADD_BADGE':
      if (state.badges.some((b) => b.id === action.badge.id)) return state;
      return { ...state, badges: [...state.badges, action.badge] };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'RESET':
      return { ...initialState, hydrated: true };
    default:
      return state;
  }
}

const STORAGE_KEY = 'lengua-viva/state/v1';

const StateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        dispatch({ type: 'HYDRATE', state: raw ? JSON.parse(raw) : {} });
      })
      .catch(() => dispatch({ type: 'HYDRATE', state: {} }));
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...persistable } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistable)).catch(() => {});
  }, [state]);

  const value = useMemo(() => state, [state]);
  return (
    <StateContext.Provider value={value}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  return useContext(StateContext);
}

export function useAppDispatch(): React.Dispatch<Action> {
  return useContext(DispatchContext);
}
