import type { WalletProvider } from '@fuel-wallet/types';

import { Fuel } from '../Fuel';

import { createReadOnly } from './createReadOnly';

export function injectFuel(
  target: object & { fuel?: Fuel },
  walletProvider: WalletProvider
) {
  if (target.fuel) {
    target.fuel.addWalletProvider(walletProvider);
    return;
  }
  const fuel = createReadOnly(new Fuel(walletProvider));
  Object.defineProperty(target, 'fuel', {
    value: fuel,
    writable: false,
    enumerable: true,
    configurable: true,
  });

  if (typeof document !== 'undefined') {
    // Dispatch event fuel loaded into the document
    const fuelLoadedEvent = new CustomEvent('FuelLoaded', {
      detail: fuel,
    });
    document.dispatchEvent(fuelLoadedEvent);
  }
}
