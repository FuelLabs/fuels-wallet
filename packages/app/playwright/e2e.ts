import {
  FuelWalletDevelopmentConnector,
  defaultConnectors,
} from '@fuels/connectors';
import { Address, Fuel } from 'fuels';

localStorage.clear();

window.fuel = new Fuel({
  connectors: [new FuelWalletDevelopmentConnector()],
});

window.createAddress = (address: string) => Address.fromString(address);
