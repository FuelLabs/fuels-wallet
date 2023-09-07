import { globalCss } from '@fuel-ui/css';
import {
  darkTheme,
  lightTheme,
  loadIcons,
  setFuelThemes,
  ThemeProvider,
} from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { StoreProvider } from '~/store';

// eslint-disable-next-line import/no-absolute-path
import icons from '/icons/sprite.svg';

import { ErrorBoundary } from '~/systems/Error';

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
  },
  '.fuel_AlertDialog-content': {
    maxWidth: '300px !important',
    boxSizing: 'border-box !important',
    paddingTop: '$6 !important',
    paddingBottom: '$6 !important',
  },
  '.fuel_AlertDialog-description': {
    margin: 0,
  },
  '.fuel_AlertDialog-footer > button': {
    flex: 1,
  },
  '.fuel_Dialog-content': {
    maxWidth: '350px !important',
  },
  ':root': {
    '--colors-inputBaseBg': 'var(--colors-cardBg)',
  },
};

// this is temporary until we find a better solution
loadIcons(icons);
setFuelThemes({
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <StoreProvider>
          {globalCss(customStyles)()}
          {children}
        </StoreProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
