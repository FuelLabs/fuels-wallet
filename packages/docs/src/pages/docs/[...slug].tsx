import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Blockquote } from '../../components/Blockquote';
import { Code } from '../../components/Code';
import { Heading } from '../../components/Heading';
import { Layout } from '../../components/Layout';
import { UL } from '../../components/List';
import { Pre } from '../../components/Pre';
import { Table } from '../../components/Table';
import { MENU_ORDER } from '../../constants';
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
  code: Code,
  blockquote: Blockquote,
  table: Table,
  ul: UL,
};

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
};

export default function DocPage({ doc, links }: DocPageProps) {
  const router = useRouter();
  if (!router.isFallback && !doc?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title={doc.title} doc={doc} links={links}>
      <Box as="section">
        <MDXRemote {...doc.source} components={components} />
      </Box>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string[];
  };
};

export async function getStaticProps({ params }: Params) {
  const slug = params.slug.join('/');
  const doc = await getDocBySlug(slug, ['title', 'slug', 'content']);
  const links = await getSidebarLinks(MENU_ORDER);
  return { props: { doc, links } };
}

export async function getStaticPaths() {
  const docs = await getAllDocs(['slug']);
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: [...doc.slug.split('/')],
        },
      };
    }),
    fallback: false,
  };
}
