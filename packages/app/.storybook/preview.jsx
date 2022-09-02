import { ThemeProvider } from "@fuel-ui/react";
import { themes } from "@storybook/theming";
import { BrowserRouter } from "react-router-dom";

import theme from "./theme";

export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*",
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: (a, b) => {
      return a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
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
};

export const decorators = [
  (Story) => (
    <BrowserRouter>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </BrowserRouter>
  ),
];
