import {
  ThemeProvider,
  darkTheme,
  globalCss,
  lightTheme,
  setFuelThemes,
} from '@fuel-wallet/ui';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { StoreProvider } from '~/store';

import { ErrorBoundary } from '~/systems/Error';
import '@fuel-wallet/ui/styles.css';

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
  },
  '.fuel_AlertDialog-footer > button': {
    flex: 1,
  },
};

setFuelThemes({
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <StoreProvider>
            {globalCss(customStyles)()}
            {children}
          </StoreProvider>
        </ErrorBoundary>
      </MotionConfig>
    </ThemeProvider>
  );
}
