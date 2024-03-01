import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { Address, Fuel } from 'fuels';

window.fuel = new Fuel({
  connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
});
window.createAddress = (address: string) => Address.fromString(address);
