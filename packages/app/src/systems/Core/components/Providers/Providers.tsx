import { darkColors, globalCss } from '@fuel-ui/css';
import { createTheme, ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { StoreProvider } from '~/store';
import { ErrorBoundary } from '~/systems/Error';

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
  },
};

export const theme = createTheme('fuels-wallet', {
  tokens: {
    colors: {
      ...darkColors,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider themes={{ wallet: theme }}>
          {globalCss(customStyles)()}
          {children}
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}
