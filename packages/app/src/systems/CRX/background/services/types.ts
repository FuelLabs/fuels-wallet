import type {
  AssetData,
  FuelProviderConfig,
  NetworkData,
} from '@fuel-wallet/types';
import type { AbiMap } from 'fuels';

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
  addAssets: {
    assets: AssetData[];
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
  selectNetwork: {
    network: NetworkData;
    origin: string;
    title?: string;
    favIconUrl?: string;
  };
  addNetwork: {
    network: NetworkData;
    origin: string;
    title?: string;
    favIconUrl?: string;
  };
};
