'use client';

import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import { Breadcrumb } from '~/components/Breadcrumb';
import { DocFooter } from '~/components/DocFooter';
import { Layout } from '~/components/Layout';
import { Sidebar } from '~/components/Sidebar';
import { TableOfContent } from '~/components/TableOfContent';
import { DocProvider } from '~/hooks/useDocContext';
import type { DocType, SidebarLinkItem } from '~/utils/types';

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
          <MDXRemote {...doc.source} scope={doc} />
          <DocFooter />
        </Box>
        <TableOfContent />
      </Layout>
    </DocProvider>
  );
}
