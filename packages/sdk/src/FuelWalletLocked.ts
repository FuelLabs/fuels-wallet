import type { AbstractAddress } from 'fuels';
import { WalletLocked } from 'fuels';

import type { FuelWalletConnection } from './FuelWalletConnection';
import { FuelWalletProvider } from './FuelWalletProvider';

export class FuelWalletLocked extends WalletLocked {
  constructor(
    publicKey: string | AbstractAddress,
    walletConnection: FuelWalletConnection
  ) {
    super(publicKey, new FuelWalletProvider(walletConnection));
  }
}
