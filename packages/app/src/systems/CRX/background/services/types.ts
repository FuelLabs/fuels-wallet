import type { FuelProviderConfig } from '@fuel-wallet/types';

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
  requestConnection: {
    origin: string;
  };
};
