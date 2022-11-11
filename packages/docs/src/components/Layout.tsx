import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import type { ReactNode } from 'react';

import type { NodeHeading } from '../types';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TableOfContent } from './TableOfContent';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  headings: NodeHeading[];
};

export function Layout({ title, children, headings }: LayoutProps) {
  const titleText = title ? `${title} | Fuel Wallet` : 'Fuel Wallet';
  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <Box css={styles.root}>
        <Header />
        <Sidebar />
        <Box as="section">{children}</Box>
        {headings && <TableOfContent headings={headings} />}
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    display: 'grid',
    maxW: '100vw',
    height: '100vh',
    gridTemplateColumns: '0.75fr 2.5fr 0.75fr',
    gridTemplateRows: '80px auto',
    gridColumnGap: '$14',

    nav: {
      pl: '$8',
      py: '$8',
      display: 'flex',
      flexDirection: 'column',
      gap: '$2',
    },

    section: {
      py: '$8',
    },
  }),
};
