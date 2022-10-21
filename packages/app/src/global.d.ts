declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly BASE_URL: string;
      readonly VITE_FUEL_PROVIDER_URL: string;
      readonly VITE_FUEL_FAUCET_URL: string;
      readonly VITE_MNEMONIC_WORDS: number;
      readonly VITE_APP_VERSION: string;
      readonly VITE_CRX: string;
      readonly VITE_ADDR_OWNER: string;
      readonly VITE_STORYBOOK_URL: string;
    }
  }
}

export {};
