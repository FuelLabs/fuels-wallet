import type { AbstractAddress } from 'fuels';

import { FuelWalletConnection } from './FuelWalletConnection';
import { FuelWalletLocked } from './FuelWalletLocked';
import { FuelWalletProvider } from './FuelWalletProvider';

export class Fuel extends FuelWalletConnection {
  getWallet(address: string | AbstractAddress): FuelWalletLocked {
    return new FuelWalletLocked(address, this);
  }

  getProvider(): FuelWalletProvider {
    return new FuelWalletProvider(this);
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fuel: Fuel | undefined;
  }
}
