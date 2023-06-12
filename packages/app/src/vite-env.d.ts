/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_FUEL_FAUCET_URL: string;
  readonly VITE_MNEMONIC_WORDS: number;
  readonly VITE_APP_VERSION: string;
  readonly VITE_CRX: string;
  readonly VITE_ADDR_OWNER: string;
  readonly VITE_AUTO_LOCK_IN_MINUTES: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add script module importing
declare module '*?script&module' {
  const src: string;
  export default src;
}

// Add script  importing
declare module '*?script' {
  const src: string;
  export default src;
}
