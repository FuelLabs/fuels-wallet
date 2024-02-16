import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuel-wallet/sdk';
import { Address, Fuel } from 'fuels';

window.fuel = new Fuel({
  connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
});
window.createAddress = (address: string) => Address.fromString(address);
