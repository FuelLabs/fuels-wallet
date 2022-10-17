import { FuelWeb3 } from '../FuelWeb3';

import { createReadOnly } from './createReadOnly';

export function injectFuelWeb3(target: object) {
  Object.defineProperty(target, 'FuelWeb3', {
    value: createReadOnly(new FuelWeb3()),
    writable: false,
    enumerable: true,
    configurable: true,
  });
}
