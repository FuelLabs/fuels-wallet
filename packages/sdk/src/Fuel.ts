import { Address, WalletLocked } from 'fuels';
import type { AbstractAddress } from 'fuels';

import { FuelWalletConnection } from './FuelWalletConnection';
import { FuelWalletProvider } from './FuelWalletProvider';

// Isolate the provider instance to prevent
// developers from replacing the provider
// instance with a new one
const FuelWeb3Privates: {
  provider?: FuelWalletProvider;
} = {};

export class Fuel extends FuelWalletConnection {
  readonly utils = {
    // TODO: remove createAddress once fuels-ts replace input
    // class address with string. The warn message is to avoid
    // developers to use this method.
    createAddress: (address: string) => {
      // eslint-disable-next-line no-console
      console.warn(
        'Do not use this method! It will be removed in the next release.'
      );
      return Address.fromString(address);
    },
  };

  async getProvider(): Promise<FuelWalletProvider> {
    // TODO: This solution should be improved by issue #506
    // by moving all connection throw events
    const providerConfig = await this.network();
    // Return the current provider instance if it exists
    if (FuelWeb3Privates.provider) {
      return FuelWeb3Privates.provider;
    }
    // Otherwise, create a new provider instance
    // fetch the current network and connect the provider
    const provider = new FuelWalletProvider(providerConfig.url, this);
    FuelWeb3Privates.provider = provider;

    // Listen for network changes and connect the provider
    // selected network from the user
    this.on('network', async (network) => {
      FuelWeb3Privates.provider?.connect(network.url);
    });

    return FuelWeb3Privates.provider;
  }

  async getWallet(address: string | AbstractAddress): Promise<WalletLocked> {
    const provider = await this.getProvider();
    return new WalletLocked(address, provider);
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fuel: Fuel | undefined;
  }
}
