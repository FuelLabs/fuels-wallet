import { CRXPages } from './systems/Core/types';

export const VITE_FUEL_PROVIDER_URL = import.meta.env.VITE_FUEL_PROVIDER_URL;
export const VITE_FAUCET_RECAPTCHA_KEY = import.meta.env
  .VITE_FAUCET_RECAPTCHA_KEY;
export const VITE_FUEL_FAUCET_URL = import.meta.env.VITE_FUEL_FAUCET_URL;
export const VITE_ADDR_OWNER = import.meta.env.VITE_ADDR_OWNER;
export const VITE_CRX = import.meta.env.VITE_CRX;
export const NODE_ENV = import.meta.env.NODE_ENV;

export const DECIMAL_UNITS = 9;
export const FORMAT_LANGUAGE = 'es';
export const MIN_FRACTION_DIGITS = 1;
export const MAX_FRACTION_DIGITS = 3;
export const MNEMONIC_SIZE = 16;
export const WALLET_WIDTH = 350;
export const WALLET_HEIGHT = 600;
export const TAB_BAR_HEIGHT = 30;
export const IS_CRX = VITE_CRX === 'true';
export const IS_LOGGED_KEY = 'fuel__isLogged';
export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_CRX_POPUP =
  IS_CRX && globalThis.location.pathname === CRXPages.popup;
