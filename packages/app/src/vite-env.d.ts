/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_FUEL_FAUCET_URL: string;
  readonly VITE_MNEMONIC_WORDS: number;
  readonly VITE_APP_VERSION: string;
  readonly VITE_CRX: string;
  readonly VITE_ADDR_OWNER: string;
  readonly VITE_CRX_NAME: string;
  readonly VITE_AUTO_LOCK_IN_MINUTES: number;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_IGNORE_ERRORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add script module importing
declare module '*?script&module' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}

// Add script  importing
declare module '*?script' {
  const src: string;
  export default src;
}

declare module '@fuel-ui/react/unsafe-passwords' {
  const src: string[];
  export default src;
}
