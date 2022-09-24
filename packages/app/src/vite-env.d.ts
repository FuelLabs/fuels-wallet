/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUEL_PROVIDER_URL: string;
  readonly VITE_FUEL_FAUCET_URL: string;
  readonly VITE_MNEMONIC_WORDS: number;
  readonly CRX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace globalThis {
  function FuelWeb3(): void;
}
