/// <reference types="vite/client" />

declare namespace NodeJS {
  export interface ProcessEnv {
    PUBLIC_URL: string;
    VITE_FUEL_PROVIDER_URL: string;
    VITE_FUEL_FAUCET_URL: string;
    VITE_MNEMONIC_WORDS: number;
  }
}
