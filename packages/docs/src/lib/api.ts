import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './src/docs');

export async function getDocsSlugs() {
  const paths = await globby(['**.mdx']);
  return paths.map((item) => item.replace('src/docs/', ''));
}

export function getDocFullPath(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  return join(DOCS_DIRECTORY, `${realSlug}.mdx`);
}

export async function getDocBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = getDocFullPath(slug);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = data.slug || realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export async function getAllDocs(fields: string[] = []) {
  const slugs = await getDocsSlugs();
  return Promise.all(slugs.map((slug) => getDocBySlug(slug, fields)));
}
