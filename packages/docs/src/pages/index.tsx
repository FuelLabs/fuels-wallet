import { Layout } from '../components/Layout';
import { getAllDocs } from '../lib/api';
import type { DocType } from '../types';

type HomeProps = {
  allDocs: DocType[];
};

export default function Home({ allDocs }: HomeProps) {
  return (
    <Layout title="Home" allDocs={allDocs}>
      <article>Hello world</article>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const allDocs = getAllDocs(['title', 'slug']);
  return {
    props: { allDocs },
  };
};
