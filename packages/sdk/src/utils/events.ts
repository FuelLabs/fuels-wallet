import type { FuelWalletConnector } from '@fuel-wallet/types';
import { FuelWindowEvents } from '@fuel-wallet/types';

/**
 * Custom event to query available Fuel connectors
 */
export class FuelConnectorEvent extends CustomEvent<void> {
  constructor() {
    super(FuelWindowEvents.FuelConnector);
  }
}

/**
 * Custom event to notify application that Fuel is loaded
 */
export class FuelLoadedEvent extends CustomEvent<FuelWalletConnector> {
  constructor(connector: FuelWalletConnector) {
    super(FuelWindowEvents.FuelConnector, {
      detail: connector,
    });
  }
}
