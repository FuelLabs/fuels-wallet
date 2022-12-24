import { Fuel } from '../Fuel';

import { createReadOnly } from './createReadOnly';

export function injectFuel(target: object) {
  Object.defineProperty(target, 'fuel', {
    value: createReadOnly(new Fuel()),
    writable: false,
    enumerable: true,
    configurable: true,
  });
}
