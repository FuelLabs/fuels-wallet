/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_CONTRACT_ID: string;
  readonly EXTERNAL_CONTRACT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
