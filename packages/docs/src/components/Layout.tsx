import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import type { ReactNode } from 'react';

import type { DocType } from '../types';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  allDocs: DocType[];
};

export function Layout({ title, children, allDocs }: LayoutProps) {
  const titleText = title ? `${title} | Fuel Wallet` : 'Fuel Wallet';
  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <Box css={styles.root}>
        <Box as="nav">
          <Link href="/">Home</Link>
          {allDocs.map((doc) => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`}>
              {doc.title}
            </Link>
          ))}
        </Box>
        <Box as="section">{children}</Box>
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    display: 'grid',
    height: '100vh',
    gridTemplateColumns: '200px 1fr',

    nav: {
      padding: '$8',
      display: 'flex',
      flexDirection: 'column',
      gap: '$2',
    },

    section: {
      padding: '$8',
    },
  }),
};
