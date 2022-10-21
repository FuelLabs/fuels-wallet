declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      BASE_URL: string;
      VITE_FUEL_PROVIDER_URL: string;
      VITE_FUEL_FAUCET_URL: string;
      VITE_MNEMONIC_WORDS: number;
      VITE_APP_VERSION: string;
      VITE_CRX: string;
      VITE_ADDR_OWNER: string;
      VITE_STORYBOOK_URL: string;
    }
  }
}

export {};
