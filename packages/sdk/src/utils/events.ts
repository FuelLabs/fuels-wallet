import type { FuelWalletConnector } from '@fuel-wallet/types';
import { FuelWindowEvents } from '@fuel-wallet/types';

/**
 * Custom event to query available Fuel connectors
 */
export class FuelConnectorEvent extends Event {
  constructor() {
    super(FuelWindowEvents.FuelConnector);
  }
}

/**
 * Custom event to notify application that Fuel is loaded
 */
export class FuelLoadedEvent extends Event {
  connector: FuelWalletConnector;

  constructor(connector: FuelWalletConnector) {
    super(FuelWindowEvents.FuelLoaded);
    this.connector = connector;
  }
}
