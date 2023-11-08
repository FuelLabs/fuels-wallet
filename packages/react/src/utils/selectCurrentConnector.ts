import type { Fuel, FuelConnector } from '@fuel-wallet/sdk';

import { CONNECTOR_KEY } from '../config';

export function selectCurrentConnector(
  fuel: Fuel,
  connectors: Array<FuelConnector>
) {
  // If a connector is already select wait for it to be available
  // on the connectors list and select it as a connector
  const currentConnector = localStorage.getItem(CONNECTOR_KEY);
  if (!currentConnector) return;
  const hasConnector = connectors.find((c) => c.name === currentConnector);
  const isCurrentConnector = fuel.currentConnector()?.name === currentConnector;
  if (!hasConnector || isCurrentConnector) return;
  // Select current connector
  return fuel.selectConnector(currentConnector);
}
