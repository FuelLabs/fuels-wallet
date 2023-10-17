import type { Fuel, FuelWalletConnector } from '@fuel-wallet/sdk';

import { CONNECTOR_KEY } from '../config';

export function selectCurrentConnector(
  fuel: Fuel,
  connectors: Array<FuelWalletConnector>,
) {
  // If a connector is already select wait for it to be available
  // on the connectors list and select it as a connector
  const currentConnector = localStorage.getItem(CONNECTOR_KEY);
  if (!currentConnector) return;
  const hasConnector = connectors.find((c) => c.name === currentConnector);
  const isCurrentConnector = fuel.connectorName === currentConnector;
  if (!hasConnector || isCurrentConnector) return;
  // Select current connector
  return fuel.selectConnector(currentConnector);
}
