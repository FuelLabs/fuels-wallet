/// <reference types="vite/client" />
import type { FuelWeb3 } from '@fuels-wallet/sdk';

declare global {
  interface Window {
    FuelWeb3: FuelWeb3;
  }
}

interface ImportMetaEnv {
  readonly VITE_WALLET_PREVIEW_URL: string;
  readonly VITE_WALLET_DOWNLOAD_URL: string;
  readonly VITE_STORYBOOK_URL: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
