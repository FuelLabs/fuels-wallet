/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading } from '@fuel-ui/react';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Layout } from '../../components/Layout';
import { getAllDocs, getDocBySlug } from '../../lib/api';

const components = {
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
};

export default function DocPage({ source, doc, frontmatter, allDocs }: any) {
  const router = useRouter();
  if (!router.isFallback && !doc?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title={frontmatter.title} allDocs={allDocs}>
      <MDXRemote {...source} components={components} />
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const allDocs = getAllDocs(['title', 'slug']);
  const doc = getDocBySlug(params.slug, ['title', 'slug', 'content']);
  const { content, data } = matter(doc.content);
  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: {
      format: 'md',
    },
  });
  return {
    props: {
      doc,
      allDocs,
      frontmatter: data,
      source: mdxSource,
    },
  };
}

export async function getStaticPaths() {
  const docs = getAllDocs(['slug']);
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: doc.slug,
        },
      };
    }),
    fallback: false,
  };
}
