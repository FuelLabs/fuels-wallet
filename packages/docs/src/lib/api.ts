import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './src/docs');

export function getDocsSlugs() {
  return fs.readdirSync(DOCS_DIRECTORY);
}

export function getDocBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(DOCS_DIRECTORY, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
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

export function getAllDocs(fields: string[] = []) {
  const slugs = getDocsSlugs();
  const docs = slugs.map((slug) => getDocBySlug(slug, fields));
  return docs;
}
