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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import icons from '~icons-url';

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
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
      <StoreProvider>
        {globalCss(customStyles)()}
        {children}
      </StoreProvider>
    </ThemeProvider>
  );
}
