import type { AbiMap, Asset, FuelProviderConfig } from '@fuel-wallet/types';

export type MessageInputs = {
  signMessage: {
    message: string;
    address: string;
    origin: string;
    title?: string;
    favIconUrl?: string;
  };
  sendTransaction: {
    address: string;
    origin: string;
    title?: string;
    favIconUrl?: string;
    provider: FuelProviderConfig;
    transaction: string;
  };
  addAsset: {
    asset: Asset;
  };
  addAssets: {
    assets: Asset[];
    origin: string;
    title?: string;
    favIconUrl?: string;
  };
  requestConnection: {
    origin: string;
    title?: string;
    favIconUrl?: string;
    totalAccounts: number;
  };
  addAbi: {
    abiMap: AbiMap;
  };
  getAbi: {
    contractId: string;
  };
};
