/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_URL: string;
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_FUEL_FAUCET_URL: string;
  readonly VITE_MNEMONIC_WORDS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
