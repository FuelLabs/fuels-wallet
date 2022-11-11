import type { AbstractAddress } from 'fuels';

import { FuelWeb3Provider } from './FuelWeb3Provider';
import { FuelWeb3SDK } from './FuelWeb3SDK';
import { FuelWeb3Wallet } from './FuelWeb3Wallet';

export class FuelWeb3 extends FuelWeb3SDK {
  static FuelWeb3Provider = FuelWeb3Provider;
  static FuelWeb3Wallet = FuelWeb3Wallet;

  getWallet(address: string | AbstractAddress): FuelWeb3Wallet {
    return new FuelWeb3Wallet(address, this);
  }

  getProvider(): FuelWeb3Provider {
    return new FuelWeb3Provider(this);
  }
}
