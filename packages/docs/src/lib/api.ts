import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { join } from 'path';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import type { DocType, NodeHeading, SidebarLinkItem } from '../types';

import { rehypeExtractHeadings } from './toc';

const DOCS_DIRECTORY = join(process.cwd(), './src/docs');
const REPO_LINK =
  'https://github.com/FuelLabs/fuels-wallet/blob/master/packages/docs';

export async function getDocsSlugs() {
  const paths = await globby(['**.mdx']);
  return paths.map((item) => item.replace('src/docs/', ''));
}

export function getDocFullPath(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  return join(DOCS_DIRECTORY, `${realSlug}.mdx`);
}

export async function getDocBySlug(
  slug: string,
  fields: string[] = []
): Promise<DocType> {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullpath = getDocFullPath(slug);
  const fileContents = fs.readFileSync(fullpath, 'utf8');
  const { data, content } = matter(fileContents);
  const pageLink = join(REPO_LINK, fullpath.replace(process.cwd(), ''));

  const doc = {
    pageLink,
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      doc[field] = data.slug || realSlug;
    }
    if (field === 'content') {
      doc[field] = content;
    }
    if (typeof data[field] !== 'undefined') {
      doc[field] = data[field];
    }
  });

  const headings: NodeHeading[] = [];
  const source = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [remarkSlug, remarkGfm],
      rehypePlugins: [[rehypeExtractHeadings, { headings }]],
    },
  });

  return {
    ...doc,
    source,
    headings,
  } as DocType;
}

export async function getAllDocs(fields: string[] = []) {
  const slugs = await getDocsSlugs();
  return Promise.all(slugs.map((slug) => getDocBySlug(slug, fields)));
}

export async function getSidebarLinks(order: string[]) {
  const docs = await getAllDocs(['title', 'slug', 'category']);
  const links: SidebarLinkItem[] = [];

  docs.forEach((doc) => {
    /** Insert based on order prop if there's no category */
    if (!doc.category) {
      links.push({ slug: doc.slug, label: doc.title });
      return;
    }

    /** Insert inside category submenu if category is already on array */
    const categoryIdx = links.findIndex((l) => l.label === doc.category);
    const categorySlug = doc.category.replace(' ', '-').toLowerCase();
    if (categoryIdx > 0) {
      const submenu = links[categoryIdx].submenu || [];
      submenu.push({ slug: doc.slug, label: doc.title });
      return;
    }

    /** Insert category item based on order prop */
    const submenu = [{ slug: doc.slug, label: doc.title }];
    links.push({ subpath: categorySlug, label: doc.category, submenu });
  });

  const sortedLinks = links
    /** Sort first level links */
    .sort((a, b) => {
      const aIdx = order.indexOf(a.label);
      const bIdx = order.indexOf(b.label);
      if (!a.subpath && !b.subpath) return aIdx - bIdx;
      const category = a.subpath ? a.label : b.label;
      const first = order.filter((i) => i.startsWith(category))?.[0];
      const idx = order.indexOf(first);
      return a.subpath ? idx - bIdx : aIdx - idx;
    })
    /** Sort categoried links */
    .map((link) => {
      if (!link.submenu) return link;
      const catOrder = order.filter((i) => i.startsWith(link.label));
      const submenu = link.submenu.sort(
        (a, b) =>
          catOrder.indexOf(`${link.label}/${a.label}`) -
          catOrder.indexOf(`${link.label}/${b.label}`)
      );
      return { ...link, submenu };
    });

  return sortedLinks;
}
