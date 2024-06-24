import type { AppProps } from 'next/app';
import 'plyr-react/plyr.css';
import '../styles/docsearch/_variables.css';
import '../styles/docsearch/button.css';
import '../styles/docsearch/modal.css';
import '../styles/docsearch/style.css';
import '../styles/index.css';

import { Provider } from '../components/Provider';

import type { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const currentDomainUrlServerSide = `${protocol}://${host}`;

  return {
    props: {
      currentDomainUrlServerSide,
    },
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const currentDomainUrl =
    !pageProps?.currentDomainUrlServerSide && typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}`
      : pageProps?.currentDomainUrlServerSide;

  return (
    <Provider currentDomainUrl={currentDomainUrl}>
      <Component {...pageProps} />
    </Provider>
  );
}
