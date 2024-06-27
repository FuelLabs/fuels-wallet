import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import type { ReactNode } from 'react';

import { META_DESC, META_OGIMG } from '../constants';

import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { Header } from './Header';

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const extensionName = useExtensionTitle();
  const titleText = `${title ? `${title} ` : ''} | ${extensionName}`;
  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta name="description" content={META_DESC} key="desc" />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:image" content={META_OGIMG} />
      </Head>
      <Box css={styles.root}>
        <Header />
        {children}
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    maxW: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '80px auto',

    '@xl': {
      gridTemplateColumns: '0.75fr 2.5fr 0.75fr',
      gridTemplateRows: '80px auto',
      gridColumnGap: '$14',
    },
  }),
};
