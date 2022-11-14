import type { AbstractAddress } from 'fuels';
import { WalletLocked } from 'fuels';

import { FuelWeb3Provider } from './FuelWeb3Provider';
import type { FuelWeb3SDK } from './FuelWeb3SDK';

export class FuelWeb3Wallet extends WalletLocked {
  constructor(publicKey: string | AbstractAddress, fuelWeb3: FuelWeb3SDK) {
    super(publicKey, new FuelWeb3Provider(fuelWeb3));
  }
}
