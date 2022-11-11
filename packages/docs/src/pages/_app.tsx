import '../styles/index.css';
import 'dracula-prism/dist/css/dracula-prism.css';

import { ThemeProvider } from '@fuel-ui/react';
import type { AppProps } from 'next/app.js';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
