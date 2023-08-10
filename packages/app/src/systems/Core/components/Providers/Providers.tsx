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

type ProvidersProps = {
  children: ReactNode;
};

const customStyles = {
  body: {
    margin: '0 auto !important',
  },
  '.fuel_AlertDialog-content': {
    maxWidth: '300px',
  },
  '.fuel_Dialog-content': {
    maxWidth: '350px',
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
