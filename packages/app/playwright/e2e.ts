import { defaultConnectors } from '@fuels/connectors';
import { Address, Fuel, type StorageAbstract } from 'fuels';

window.fuel = new Fuel({
  connectors: defaultConnectors(),
  storage: {
    getItem: () => Promise.resolve(undefined),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    clear: () => Promise.resolve(),
  } as StorageAbstract,
});

window.createAddress = (address: string) => Address.fromString(address);
