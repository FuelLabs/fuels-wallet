import type { FuelWalletConnector } from '@fuel-wallet/types';

import { Fuel } from '../Fuel';

import { createReadOnly } from './createReadOnly';

type ObjectTarget = object & { fuel?: Fuel };

function injectFuel(fuel: Fuel, target: object & { fuel?: Fuel }) {
  const fuelObj = createReadOnly(fuel);
  Object.defineProperty(target, 'fuel', {
    value: fuel,
    writable: false,
    enumerable: true,
    configurable: true,
  });

  if (typeof document !== 'undefined') {
    // Dispatch event fuel loaded into the document
    const fuelLoadedEvent = new CustomEvent('FuelLoaded', {
      detail: fuelObj,
    });
    document.dispatchEvent(fuelLoadedEvent);
  }
}

export function createConnector(
  conector: FuelWalletConnector,
  target?: ObjectTarget
) {
  if (target?.fuel) {
    target.fuel.addConnector(conector);
    return;
  }
  injectFuel(new Fuel(conector), target || (window as ObjectTarget));
}
