import '../styles/index.css';
import '../styles/docsearch/_variables.css';
import '../styles/docsearch/button.css';
import '../styles/docsearch/modal.css';
import '../styles/docsearch/style.css';
import { ThemeProvider } from '@fuel-ui/react';
import type { AppProps } from 'next/app.js';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
