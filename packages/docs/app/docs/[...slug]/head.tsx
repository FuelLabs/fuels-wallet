import type { DocPageProps } from './page';

import { getDocBySlug } from '~/lib/api';
import { FIELDS } from '~/utils/constants';

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
