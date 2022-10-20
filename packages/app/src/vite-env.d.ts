/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_FUEL_FAUCET_URL: string;
  readonly VITE_MNEMONIC_WORDS: number;
  readonly VITE_APP_VERSION: string;
  readonly VITE_CRX: string;
  readonly VITE_ADDR_OWNER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add script module importing
declare module '*?script&module' {
  const src: string;
  export default src;
}
