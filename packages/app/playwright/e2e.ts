import {
  Fuel,
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuel-wallet/sdk';
import { Address } from 'fuels';

window.fuel = new Fuel({
  connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
});
window.createAddress = (address: string) => Address.fromString(address);
