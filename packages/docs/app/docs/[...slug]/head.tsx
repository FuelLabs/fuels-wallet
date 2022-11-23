import type { DocPageProps } from './page';

import { FIELDS } from '~/src/constants';
import { getDocBySlug } from '~/src/lib/api';

export default async function Head({ params }: DocPageProps) {
  const slug = params.slug.join('/');
  const doc = await getDocBySlug(slug, FIELDS);
  const title = `${doc.title} | Fuel Wallet`;
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </>
  );
}
