/// <reference types="vite/client" />

declare let process: {
  env: {
    PUBLIC_URL: string;
    VITE_FUEL_PROVIDER_URL: string;
    VITE_FUEL_FAUCET_URL: string;
    VITE_MNEMONIC_WORDS: number;
  };
};
