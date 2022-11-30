import '../styles/index.css';
import '../styles/docsearch/_variables.css';
import '../styles/docsearch/button.css';
import '../styles/docsearch/modal.css';
import '../styles/docsearch/style.css';
import 'plyr-react/plyr.css';
import type { AppProps } from 'next/app';

import { Provider } from '../components/Provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
