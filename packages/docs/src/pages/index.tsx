/* eslint-disable import/no-named-default */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  default as DocPage,
  getStaticProps as docsGetStaticProps,
} from './docs/[...slug]';

export default function Home(props: any) {
  return <DocPage {...props} />;
}

export async function getStaticProps() {
  return docsGetStaticProps({ params: { slug: ['install'] } });
}
