import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { Address, Fuel } from 'fuels';
import { VITE_CRX_NAME } from '../src/config';

localStorage.clear();

const connectors = [];

// Do not change this. This fixes e2e flakyness triggered by different env variables.
switch (VITE_CRX_NAME) {
  case 'Fuel Wallet Development':
    connectors.push(new FuelWalletDevelopmentConnector());
    break;
  case 'Fuel Wallet':
    connectors.push(new FuelWalletConnector());
    break;
  default:
    throw new Error('VITE_CRX_NAME is not set to a valid value');
}

window.fuel = new Fuel({
  connectors,
});
window.createAddress = (address: string) => Address.fromString(address);
