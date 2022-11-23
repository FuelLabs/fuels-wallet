import { DEFAULT_SLUG, FIELDS, MENU_ORDER } from '~/src/constants';
import { getAllDocs, getDocBySlug, getSidebarLinks } from '~/src/lib/api';
import { DocScreen } from '~/src/screens/DocPage';
import type { SidebarLinkItem } from '~/src/types';

export type DocPageProps = {
  params: {
    slug: string[];
  };
};

export default async function DocPage({ params }: DocPageProps) {
  const slug = (params.slug || DEFAULT_SLUG)?.join('/');
  const doc = await getDocBySlug(slug, FIELDS);
  const links = await getSidebarLinks(MENU_ORDER);
  const docLink = links
    .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
    .find((i) => i.slug === doc.slug);

  return <DocScreen {...{ doc, docLink, links }} />;
}

export async function generateStaticParams() {
  const docs = await getAllDocs(FIELDS);
  return docs.map((doc) => ({
    slug: [...(doc.slug || '').split('/')],
  }));
}
