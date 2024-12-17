import { CRXPages } from './systems/Core/types';

export const {
  VITE_MNEMONIC_WORDS,
  VITE_FUEL_PROVIDER_URL,
  VITE_FUEL_FAUCET_URL,
  VITE_APP_VERSION,
  VITE_DATABASE_VERSION,
  VITE_CRX_NAME,
  VITE_CRX,
  VITE_CRX_VERSION_API,
  VITE_AUTO_LOCK_IN_MINUTES,
  VITE_SENTRY_DSN,
  VITE_EXPLORER_URL,
  NODE_ENV,
} = import.meta.env;

export const EXPLORER_URL = VITE_EXPLORER_URL;
export const WALLET_NAME = VITE_CRX_NAME;
export const APP_VERSION = VITE_APP_VERSION;
export const DATABASE_VERSION = Number(VITE_DATABASE_VERSION);
export const FORMAT_LANGUAGE = 'en-US';
export const MIN_FRACTION_DIGITS = 1;
export const MAX_FRACTION_DIGITS = 3;
export const MNEMONIC_SIZE = 16;
export const WALLET_WIDTH = 350;
export const WALLET_HEIGHT = 600;
export const TAB_BAR_HEIGHT = 30;
export const IS_CRX =
  typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';
export const IS_LOGGED_KEY = 'isLogged';
export const HAS_ACCEPTED_TERMS_KEY = 'hasAcceptedTerms';
export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_CRX_POPUP =
  IS_CRX && globalThis.location.pathname === CRXPages.popup;
/** Time in minutes before Wallet auto locks */
export const AUTO_LOCK_IN_MINUTES = VITE_AUTO_LOCK_IN_MINUTES;
export const MIN_NODE_VERSION = '0.33.0';
