import type { FuelWalletConnector } from '@fuel-wallet/types';

export function createConnector(connector: FuelWalletConnector) {
  if (typeof document === 'undefined') {
    throw new Error('Document object was not found on the window!');
  }
  // Dispatch event fuel loaded into the document
  const fuelLoadedEvent = new CustomEvent('FuelLoaded', {
    detail: connector,
  });
  document.dispatchEvent(fuelLoadedEvent);
}
