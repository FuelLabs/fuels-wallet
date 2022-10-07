export const createReadOnly = <T extends object>(fuelWeb3: T) => {
  return new Proxy(fuelWeb3, {
    get(target, prop) {
      return target[prop];
    },
    set(target, key) {
      if (Object.hasOwn(target, key)) return target[key];
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
