import { FuelWindowEvents, type FuelWalletConnector } from '@fuel-wallet/types';

import { FuelLoadedEvent } from './events';

export function createConnector(connector: FuelWalletConnector) {
  if (typeof window === 'undefined') {
    throw new Error('Document object was not found on the window!');
  }
  // Dispatch event fuel loaded into the document
  const fuelLoadedEvent = new FuelLoadedEvent(connector);
  window.dispatchEvent(fuelLoadedEvent);
  // Listen for FuelConnector query event
  window.addEventListener(FuelWindowEvents.FuelConnector, () => {
    window.dispatchEvent(fuelLoadedEvent);
  });
}
