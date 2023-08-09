import React from 'react';
import {
  darkTheme,
  lightTheme,
  loadIcons,
  setFuelThemes,
  ThemeProvider,
} from '@fuel-ui/react';
import { themes } from '@storybook/theming';
import { mswDecorator, initialize } from 'msw-storybook-addon';
import { withRouter } from 'storybook-addon-react-router-v6';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import icons from '~icons-url';

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { StoreProvider } from '../src/systems/Store';
import { WALLET_WIDTH, WALLET_HEIGHT } from '../src/config';

import theme from './theme';

export const parameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
  darkMode: {
    stylePreview: true,
    dark: {
      ...themes.dark,
      ...theme,
      appBg: '#101010',
      barBg: '#151515',
    },
    light: {
      ...themes.light,
      ...theme,
    },
    darkClass: darkTheme.theme.className,
    lightClass: lightTheme.theme.className,
  },
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      chromeExtension: {
        name: 'Chrome Extension',
        styles: {
          width: `${WALLET_WIDTH}px`,
          height: `${WALLET_HEIGHT}px`,
        },
        type: 'mobile',
      },
    },
  },
};

loadIcons(icons);
setFuelThemes({
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
});

export const decorators = [
  mswDecorator,
  withRouter,
  (Story: any) => (
    <StoreProvider>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </StoreProvider>
  ),
];

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${process.env.STORYBOOK_BASE_URL || ''}/mockServiceWorker.js`,
  },
});
