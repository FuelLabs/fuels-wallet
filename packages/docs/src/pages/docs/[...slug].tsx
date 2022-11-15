import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Blockquote } from '../../components/Blockquote';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Code } from '../../components/Code';
import { DocFooter } from '../../components/DocFooter';
import { Heading } from '../../components/Heading';
import { Layout } from '../../components/Layout';
import { UL } from '../../components/List';
import { Paragraph } from '../../components/Paragraph';
import { Pre } from '../../components/Pre';
import { Sidebar } from '../../components/Sidebar';
import { Table } from '../../components/Table';
import { TableOfContent } from '../../components/TableOfContent';
import { FIELDS, MENU_ORDER } from '../../constants';
import { DocProvider } from '../../hooks/useDocContext';
import { getAllDocs, getDocBySlug, getSidebarLinks } from '../../lib/api';
import type { DocType, SidebarLinkItem } from '../../types';

const components = {
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  pre: Pre,
  p: Paragraph,
  code: Code,
  blockquote: Blockquote,
  table: Table,
  ul: UL,
};

type DocPageProps = {
  doc: DocType;
  docLink: SidebarLinkItem;
  links: SidebarLinkItem[];
};

export default function DocPage(props: DocPageProps) {
  const { doc } = props;
  const router = useRouter();
  if (!router.isFallback && !doc?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <DocProvider {...props}>
      <Layout title={doc.title}>
        <Sidebar />
        <Box as="section">
          <Breadcrumb doc={doc} />
          <MDXRemote {...doc.source} components={components} />
          <DocFooter />
        </Box>
        <TableOfContent />
      </Layout>
    </DocProvider>
  );
}

type Params = {
  params: {
    slug: string[];
  };
};

export async function getStaticProps({ params }: Params) {
  const slug = params.slug.join('/');
  const doc = await getDocBySlug(slug, FIELDS);
  const links = await getSidebarLinks(MENU_ORDER);
  const docLink = links
    .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
    .find((i) => i.slug === doc.slug);

  return {
    props: {
      doc,
      docLink,
      links,
    },
  };
}

export async function getStaticPaths() {
  const docs = await getAllDocs(FIELDS);
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: [...(doc.slug || '').split('/')],
        },
      };
    }),
    fallback: false,
  };
}
