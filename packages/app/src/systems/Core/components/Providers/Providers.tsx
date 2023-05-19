import { globalCss } from '@fuel-ui/css';
import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { StoreProvider } from '~/store';
import { ErrorProvider } from '~/systems/ReportError';

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
  },
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorProvider>
      <StoreProvider>
        <ThemeProvider>
          {globalCss(customStyles)()}
          {children}
        </ThemeProvider>
      </StoreProvider>
    </ErrorProvider>
  );
}
