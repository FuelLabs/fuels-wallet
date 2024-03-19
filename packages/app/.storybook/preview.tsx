import { darkTheme, lightTheme } from '@fuel-ui/react';
import { themes } from '@storybook/theming';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Providers } from '../src/systems/Core/components';

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { WALLET_HEIGHT, WALLET_WIDTH } from '../src/config';

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

export const decorators = [
  mswDecorator,
  withRouter,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (Story: any) => (
    <Providers>
      <Story />
    </Providers>
  ),
];

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${process.env.STORYBOOK_BASE_URL || ''}/mockServiceWorker.js`,
  },
});
