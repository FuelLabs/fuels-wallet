const commonTheme = {
  /* Fonts */
  '--fuel-font-family':
    '"SF Pro Rounded",ui-rounded,"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
  '--fuel-font-size': '16px',
  '--fuel-color': 'hsla(0, 0%, 56.08%, 1)',
  /* Spacing */
  '--fuel-border-radius': '6px',
  '--fuel-items-gap': '8px',
  /* Border */
  '--fuel-border': '1px solid var(--fuel-border-color)',
};

const lightTheme = {
  '--fuel-color-bold': '#000000',
  '--fuel-dialog-background': 'white',
  '--fuel-overlay-background': 'rgba(71,88,107,0.24)',
  '--fuel-connector-hover': 'rgb(241 243 244)',
  '--fuel-border-color': 'hsl(210deg 9.52% 83.53%)',
  '--fuel-border-hover': 'hsla(0, 0%, 78.04%, 1)',
  '--fuel-button-background': 'rgb(226 230 233)',
  '--fuel-button-background-hover': 'rgb(203 205 207)',
};

const darkTheme = {
  '--fuel-color-bold': '#ffffff',
  '--fuel-dialog-background': 'hsla(0,0%,8.63%,1)',
  '--fuel-overlay-background': 'rgba(0,0,0,0.6)',
  '--fuel-connector-hover': 'hsl(0deg 0% 18.77%)',
  '--fuel-border-color': 'hsl(0deg 0% 18.77%)',
  '--fuel-border-hover': 'hsla(0, 0%, 50%, 1)',
  '--fuel-button-background': 'hsla(0, 0%, 30%, 1)',
  '--fuel-button-background-hover': 'hsla(0, 0%, 40%, 1)',
};

type CustomTheme = Partial<typeof commonTheme & typeof lightTheme>;

export const getThemeVariables = (
  theme: 'light' | 'dark' | string,
  customTheme?: CustomTheme
) => {
  const colorTheme = theme === 'dark' ? darkTheme : lightTheme;
  return {
    ...commonTheme,
    ...colorTheme,
    ...customTheme,
  };
};
