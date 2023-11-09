import type { FuelConnector } from '../FuelConnector';
import { FuelConnectorEventType } from '../api';

/**
 * Fuel Connector Event is a custom event that can be used by the connector to
 * inform the Fuel Connector Manager that a new connector is available.
 */
export function dispatchFuelConnectorEvent(connector: FuelConnector) {
  window.dispatchEvent(
    new CustomEvent(FuelConnectorEventType, {
      detail: connector,
    })
  );
}
