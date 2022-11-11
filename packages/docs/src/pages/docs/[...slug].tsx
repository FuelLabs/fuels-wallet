/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading } from '@fuel-ui/react';
import matter from 'gray-matter';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { Blockquote } from '../../components/Blockquote';
import { Code } from '../../components/Code';
import { Layout } from '../../components/Layout';
import { Pre } from '../../components/Pre';
import { getAllDocs, getDocBySlug } from '../../lib/api';
import { rehypeExtractHeadings } from '../../lib/toc';
import type { DocType, NodeHeading } from '../../types';

const components = {
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
  pre: Pre,
  code: Code,
  blockquote: Blockquote,
};

type DocPageProps = {
  source: MDXRemoteSerializeResult;
  doc: DocType;
  frontmatter: any;
  headings: NodeHeading[];
};

export default function DocPage({
  source,
  doc,
  frontmatter,
  headings,
}: DocPageProps) {
  const router = useRouter();
  if (!router.isFallback && !doc?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title={frontmatter.title} headings={headings}>
      <MDXRemote {...source} components={components} />
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
  const { content, data } = matter(doc.content);
  const headings: NodeHeading[] = [];
  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkGfm],
      rehypePlugins: [[rehypeExtractHeadings, { headings }]],
    },
  });

  return {
    props: {
      doc,
      headings,
      frontmatter: data,
      source: mdxSource,
    },
  };
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
