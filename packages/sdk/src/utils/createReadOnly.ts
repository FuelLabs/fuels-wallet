import type { FuelWeb3 } from '../FuelWeb3';

export const createReadOnly = (fuelWeb3: FuelWeb3) => {
  return new Proxy(fuelWeb3, {
    get(target, prop) {
      return target[prop];
    },
    set(target, key, value) {
      // Avoid change keys of FuelWeb3, except _eventsCount and _events
      // This keys are constantly updated by the EventEmitter witch FuelWeb3
      // extends from.
      if (
        Object.hasOwn(target, key) &&
        ['_eventsCount', '_events'].includes(key as string)
      ) {
        // eslint-disable-next-line no-param-reassign
        target[key] = value;
        return true;
      }
      return false;
    },
    defineProperty(target, key) {
      if (Object.hasOwn(target, key)) return target[key];
      return false;
    },
    deleteProperty() {
      return false;
    },
  });
};
