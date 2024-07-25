import ogImage from '../public/og-image.png';

const { NEXT_PUBLIC_URL } = process.env;

export const MENU_ORDER = [
  'Install',
  'Browser Support',
  'How to Use',
  'For Developers/Getting Started',
  'For Developers/Connecting',
  'For Developers/Accounts',
  'For Developers/Assets',
  'For Developers/Sending a Transaction',
  'For Developers/Signing a Message',
  'For Developers/Networks',
  'For Developers/ABIs',
  'For Developers/Wallet Connectors',
  'For Developers/API Reference',
  'For Developers/Hooks Reference',
  'For Developers/Playwright Utils',
  'Contributing/Project Structure',
  'Contributing/Contributing Guide',
  'Contributing/Linking local dependencies',
];

export const FIELDS = ['title', 'slug', 'content', 'category'];
export const REPO_LINK = 'https://github.com/FuelLabs/fuels-wallet/blob/master';
export const DOCS_REPO_LINK = `${REPO_LINK}/packages/docs`;
export const DEFAULT_SLUG = ['install'];

export const META_DESC =
  'Native wallet for Fuel, the fatest modular execution layer';

export const META_OGIMG = `${NEXT_PUBLIC_URL}${ogImage.src}`;

export const INSTALL_LINK = process.env.NEXT_PUBLIC_WALLET_INSTALL;

export const IS_PUBLIC_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === 'true';

// If preview link them download from the path otherwise download from the main
// branch version of the documentation.
export const WALLET_LINK_NEXT = 'https://next-wallet.fuel.network';
export const WALLET_LINK_STAGING = 'https://dev-wallet.fuel.network';
export const WALLET_LINK_PROD = 'https://wallet.fuel.network';
export const WALLET_DOWNLOAD_PATH = `/app/fuel-wallet-${process.env.NEXT_PUBLIC_APP_VERSION}.zip`;
export const CURRENT_ENV = process.env.NEXT_PUBLIC_CURRENT_ENV || 'NEXT';

export enum Environment {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  NEXT = 'NEXT',
}

export const ENV_TITLES: Record<Environment, string> = {
  [Environment.PRODUCTION]: 'Fuel Wallet',
  [Environment.NEXT]: 'Fuel Wallet Next',
  [Environment.STAGING]: 'Fuel Wallet Development',
};
