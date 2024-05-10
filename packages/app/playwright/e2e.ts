import { FuelWalletDevelopmentConnector } from '@fuels/connectors';
import { Address, Fuel, Provider } from 'fuels';

localStorage.clear();

window.fuel = new Fuel({
  connectors: [new FuelWalletDevelopmentConnector()],
});

window.createAddress = (address: string) => Address.fromString(address);
