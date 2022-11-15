import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import type { ReactNode } from 'react';

import { DocProvider } from '../hooks/useDocContext';
import type { DocType, SidebarLinkItem } from '../types';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TableOfContent } from './TableOfContent';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  isHome?: boolean;
  doc?: DocType;
  links?: SidebarLinkItem[];
};

export function Layout({ title, children, doc, isHome, links }: LayoutProps) {
  const titleText = title ? `${title} | Fuel Wallet` : 'Fuel Wallet';
  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      {isHome ? (
        <Box css={styles.root}>
          <Header />
          {children}
        </Box>
      ) : (
        <DocProvider doc={doc} links={links}>
          <Box css={styles.root}>
            <Header />
            {!isHome && <Sidebar />}
            {children}
            {doc?.headings && <TableOfContent />}
          </Box>
        </DocProvider>
      )}
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
