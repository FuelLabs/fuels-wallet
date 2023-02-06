import { Fuel } from '../Fuel';

import { createReadOnly } from './createReadOnly';

export function injectFuel(target: object) {
  const fuel = createReadOnly(new Fuel());
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
