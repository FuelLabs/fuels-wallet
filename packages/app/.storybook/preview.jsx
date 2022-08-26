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
    storySort: {
      order: ["Core"],
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
