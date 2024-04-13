import { Address, Fuel, type StorageAbstract } from 'fuels';
import { MockConnector } from './mocks/connector';

window.fuel = new Fuel({
  connectors: [new MockConnector()],
  storage: {
    getItem: () => Promise.resolve('Fuel Wallet'),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    clear: () => Promise.resolve(),
  } as StorageAbstract,
});

window.createAddress = (address: string) => Address.fromString(address);
