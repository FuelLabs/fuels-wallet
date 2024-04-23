import { defaultConnectors } from '@fuels/connectors';
import { Address, Fuel, type StorageAbstract } from 'fuels';

localStorage.clear();

window.fuel = new Fuel({
  connectors: defaultConnectors(),
});

window.createAddress = (address: string) => Address.fromString(address);
