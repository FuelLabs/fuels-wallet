import { ThemeProvider } from '@fuel-ui/react';
import { themes } from '@storybook/theming';
import { mswDecorator, initialize } from 'msw-storybook-addon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { StoreProvider } from '../src/store';
import { WALLET_WIDTH, WALLET_HEIGHT } from '../src/config';

import theme from './theme';
import { join } from 'path';

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
    },
    light: {
      ...themes.light,
      ...theme,
    },
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
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
  (Story) => (
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
    url: join(process.env.STORYBOOK_BASE_URL || '', '/mockServiceWorker.js'),
  },
});
