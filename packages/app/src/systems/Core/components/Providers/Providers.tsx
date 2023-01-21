import { globalCss } from '@fuel-ui/css';
import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';

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
    <ThemeProvider>
      {globalCss(customStyles)()}
      {children}
    </ThemeProvider>
  );
}
