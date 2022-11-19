import { getAllDocs, getDocBySlug, getSidebarLinks } from '~/lib/api';
import { DocScreen } from '~/screens/DocPage';
import { FIELDS, MENU_ORDER } from '~/utils/constants';
import type { SidebarLinkItem } from '~/utils/types';

export type DocPageProps = {
  params: {
    slug: string[];
  };
};

export default async function DocPage({ params }: DocPageProps) {
  const slug = params.slug.join('/');
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
