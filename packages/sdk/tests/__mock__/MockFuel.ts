import type { FuelWalletConnector } from '@fuel-wallet/types';

import { ContentProxyConnection } from '../../src/connections';
import { createConnector, createUUID } from '../../src/utils';

import { MockBackgroundService } from './MockBackgroundService';

export type MockServices = {
  contentProxy: ContentProxyConnection;
  backgroundService: MockBackgroundService;
  destroy: () => void;
};

const FUEL_MOCK_SERVICES: Array<MockServices> = [];

function registerMockFuel(mockService: MockServices) {
  FUEL_MOCK_SERVICES.push(mockService);
}

export function cleanFuelMocks() {
  FUEL_MOCK_SERVICES.map((mock) => mock.destroy());
}

export async function mockFuel(
  connector: FuelWalletConnector = { name: 'Fuel Wallet' }
): Promise<MockServices> {
  // Create a unique id for the extension
  // This creates the ability to have multiple
  // mock extensions running at the same time
  global.chrome.runtime.id = createUUID();
  // Start the content proxy connection with
  // the connector name
  const contentProxy = ContentProxyConnection.start(connector.name);
  // Create a instance of the background service
  // with the extension id related to it
  const backgroundService = await MockBackgroundService.start(
    global.chrome.runtime.id
  );
  // Create the connector and inject Fuel on Window
  createConnector(connector);
  // Create destroy function to clean the mock
  function destroy() {
    contentProxy.destroy();
    windowEventBus.removeAllListeners();
  }

  registerMockFuel({ contentProxy, backgroundService, destroy });

  // Return the content proxy instance for cleaning
  return { contentProxy, backgroundService, destroy };
}
