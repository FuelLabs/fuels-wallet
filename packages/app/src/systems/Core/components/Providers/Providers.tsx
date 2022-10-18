import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { AuthorizeApp } from '~/systems/AppConnect';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthorizeApp />
      {children}
    </ThemeProvider>
  );
}
