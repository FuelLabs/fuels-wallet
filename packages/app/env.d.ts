declare namespace NodeJS {
  export interface ProcessEnv {
    VITE_APP_VERSION: string;
    VITE_DATABASE_VERSION: string;
    readonly VITE_FUEL_PROVIDER_URL: string;
    readonly VITE_FUEL_FAUCET_URL: string;
    readonly VITE_MNEMONIC_WORDS: string;
    readonly VITE_CRX_NAME: string;
    readonly VITE_CRX_VERSION_API: string;
    readonly VITE_CRX_RELEASE: string;
    readonly VITE_AUTO_LOCK_IN_MINUTES: string;
  }
}
