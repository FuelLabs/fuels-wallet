import type { Fuel } from '../Fuel';

export const createReadOnly = (fuel: Fuel) => {
  return new Proxy(fuel, {
    get(target, prop) {
      return target[prop];
    },
    set(target, key, value) {
      // Avoid change keys of Fuel, except _eventsCount and _events
      // This keys are constantly updated by the EventEmitter witch Fuel
      // extends from.
      if (
        Object.hasOwn(target, key) &&
        ['_eventsCount', '_events', 'connectorName'].includes(key as string)
      ) {
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
