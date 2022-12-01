import ogImage from '../public/og-image.png';

const { NEXT_PUBLIC_URL } = process.env;

export const MENU_ORDER = [
  'Install',
  'How to Use',
  'API',
  'Contributing/Project Structure',
  'Contributing/Contributing Guide',
];

export const FIELDS = ['title', 'slug', 'content', 'category'];
export const REPO_LINK = 'https://github.com/FuelLabs/fuels-wallet/blob/master';
export const DOCS_REPO_LINK = `${REPO_LINK}/packages/docs`;
export const DEFAULT_SLUG = ['install'];

export const META_DESC =
  'Native wallet for Fuel, the fatest modular execution layer';

export const META_OGIMG = `${NEXT_PUBLIC_URL}${ogImage.src}`;
