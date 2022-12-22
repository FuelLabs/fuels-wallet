import type { AbstractAddress } from 'fuels';
import { WalletLocked } from 'fuels';

import type { FuelWeb3Provider } from './FuelWeb3Provider';

export class FuelWeb3Wallet extends WalletLocked {
  provider: FuelWeb3Provider;

  constructor(
    publicKey: string | AbstractAddress,
    fuelWeb3Provider: FuelWeb3Provider
  ) {
    super(publicKey, fuelWeb3Provider);
    this.provider = fuelWeb3Provider;
  }
}
