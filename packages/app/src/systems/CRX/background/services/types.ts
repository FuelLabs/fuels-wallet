import type { AssetData, NetworkData } from '@fuel-wallet/types';
import type { AbiMap, FuelConnectorSendTxParams } from 'fuels';

export type MessageInputs = {
  signMessage: {
    message: string;
    address: string;
    origin: string;
    title?: string;
    favIconUrl?: string;
  };
  sendTransaction: FuelConnectorSendTxParams;
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
  };
  addNetwork: {
    network: NetworkData;
  };
};

export type PopUpServiceInputs = {
  selectNetwork: {
    network: Partial<NetworkData>;
    currentNetwork?: NetworkData;
    popup: 'add' | 'select';
    origin: string;
    title: string;
    favIconUrl: string;
  };
  addNetwork: {
    network: Partial<NetworkData>;
    popup: 'add';
    origin: string;
    title: string;
    favIconUrl: string;
  };
};
