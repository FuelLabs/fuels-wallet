import type { Asset, FuelProviderConfig } from '@fuel-wallet/types';

export type MessageInputs = {
  signMessage: {
    message: string;
    address: string;
    origin: string;
  };
  sendTransaction: {
    address: string;
    origin: string;
    provider: FuelProviderConfig;
    transaction: string;
  };
  addAsset: {
    asset: Asset;
    origin: string;
  };
  requestConnection: {
    origin: string;
    originTitle?: string;
    faviconUrl?: string;
  };
};
