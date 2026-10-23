import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { ToastProvider } from './components/Toast';

export const THEME_STORAGE_KEY = 'fuel-ui-theme';

export type ThemeDef = { theme: string };
export type Themes = Record<string, ThemeDef>;

/** The html class names stay `fuel_<name>-theme` so stored preferences and app selectors keep working. */
export const darkTheme: ThemeDef = { theme: 'fuel_dark-theme' };
export const lightTheme: ThemeDef = { theme: 'fuel_light-theme' };
export const DEFAULT_THEMES: Themes = { dark: darkTheme, light: lightTheme };

type State = { current: string; themes: Themes };

const listeners = new Set<() => void>();

export function getInitialTheme(names: string[]): string {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && names.includes(stored)) return stored;
  localStorage.removeItem(THEME_STORAGE_KEY);
  const system = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  return names.includes(system) ? system : names[0];
}

let state: State = {
  current: getInitialTheme(Object.keys(DEFAULT_THEMES)),
  themes: DEFAULT_THEMES,
};

/** One class on <html>, so `html[class="fuel_dark-theme"]` selectors match exactly. */
function apply({ current, themes }: State) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, current);
  const html = document.documentElement;
  for (const def of Object.values(themes)) html.classList.remove(def.theme);
  const def = themes[current];
  if (def) html.classList.add(def.theme);
}

function set(next: Partial<State>) {
  const prev = state;
  state = { ...state, ...next };
  if (prev.current !== state.current || prev.themes !== state.themes)
    apply(state);
  for (const fn of listeners) fn();
}

function setTheme(current: string) {
  set({ current });
}

export function setFuelThemes({
  themes,
  initial,
}: {
  themes: Themes;
  initial?: string;
}) {
  set({ themes, current: initial ?? getInitialTheme(Object.keys(themes)) });
  apply(state);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useFuelTheme() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
  return { current: snapshot.current, themes: snapshot.themes, setTheme };
}

export function ThemeProvider({
  children,
}: {
  children?: ReactNode;
  withFonts?: boolean;
}) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
