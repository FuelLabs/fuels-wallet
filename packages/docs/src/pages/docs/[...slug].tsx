import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Breadcrumb } from '../../components/Breadcrumb';
import { DocFooter } from '../../components/DocFooter';
import { Layout } from '../../components/Layout';
import { Sidebar } from '../../components/Sidebar';
import { TableOfContent } from '../../components/TableOfContent';
import { FIELDS, MENU_ORDER } from '../../constants';
import { DocProvider } from '../../hooks/useDocContext';
import { getAllDocs, getDocBySlug, getSidebarLinks } from '../../lib/api';
import type { DocType, SidebarLinkItem } from '../../types';

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
          <MDXRemote {...doc.source} scope={{}} />
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
