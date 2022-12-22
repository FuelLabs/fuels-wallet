import type { AbstractAddress } from 'fuels';

import { FuelWeb3Provider } from './FuelWeb3Provider';
import { FuelWeb3SDK } from './FuelWeb3SDK';
import { FuelWeb3Wallet } from './FuelWeb3Wallet';

export class FuelWeb3 extends FuelWeb3SDK {
  static FuelWeb3Provider = FuelWeb3Provider;
  static FuelWeb3Wallet = FuelWeb3Wallet;

  async getWallet(address: string | AbstractAddress): Promise<FuelWeb3Wallet> {
    const provider = await this.getProvider();
    const wallet = new FuelWeb3Wallet(address, provider);
    // TODO: remove this when the .connect is supported on fuels-ts SDK
    // once implemented, we can just do provider.connect(provider)
    // and save a have a single instance of the provider
    //
    // Having a event listenr here can cause a memory leak
    // if the wallet instance is destroyed but the event listener
    // is not removed.
    this.once('network', (network) => {
      wallet.connect(new FuelWeb3Provider(network.url, this));
    });
    return wallet;
  }

  async getProvider(): Promise<FuelWeb3Provider> {
    const network = await this.network();
    const provider = new FuelWeb3Provider(network.url, this);
    return provider;
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    FuelWeb3: FuelWeb3 | undefined;
  }
}
