import { FuelWalletConnector } from './FuelWallet';
import { FuelWalletDevelopmentConnector } from './FuelWalletDevelopment';
import { FueletWalletConnector } from './FueletWallet';

type DefaultConnectors = {
  devMode?: boolean;
};

export function defaultConnectors({ devMode }: DefaultConnectors = {}) {
  const connectors = [new FuelWalletConnector(), new FueletWalletConnector()];
  if (devMode) {
    connectors.push(new FuelWalletDevelopmentConnector());
  }
  return connectors;
}
