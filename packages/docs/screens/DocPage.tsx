'use client';

import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import {
  Layout,
  Sidebar,
  Breadcrumb,
  DocFooter,
  TableOfContent,
} from '../components';
import { DocProvider } from '../hooks/useDocContext';
import type { DocType, SidebarLinkItem } from '../utils/types';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
};

export function DocScreen(props: DocPageProps) {
  const { doc } = props;

  return (
    <DocProvider {...props}>
      <Layout title={doc.title}>
        <Sidebar />
        <Box as="section">
          <Breadcrumb doc={doc} />
          <MDXRemote {...doc.source} scope={{}} />
          <DocFooter />
        </Box>
        <TableOfContent />
      </Layout>
    </DocProvider>
  );
}
