import type { FuelWalletConnector } from '@fuel-wallet/types';

import { ContentProxyConnection } from '../../connections';
import { createConnector, createUUID } from '../../utils';

import './MockConnections';
import { MockBackgroundService } from './MockBackgroundService';

export type MockServices = {
  contentProxy: ContentProxyConnection;
  backgroundService: MockBackgroundService;
  destroy: () => void;
};

export function mockFuel(
  connector: FuelWalletConnector = { name: 'Fuel Wallet' }
): MockServices {
  // Create a unique id for the extension
  // This creates the ability to have multiple
  // mock extensions running at the same time
  global.chrome.runtime.id = createUUID();
  // Start the content proxy connection with
  // the connector name
  const contentProxy = ContentProxyConnection.start(connector.name);
  // Create a instance of the background service
  // with the extension id related to it
  const backgroundService = MockBackgroundService.start(
    global.chrome.runtime.id
  );
  // Create the connector and inject Fuel on Window
  createConnector(connector);
  // Create destroy function to clean the mock
  function destroy() {
    contentProxy.destroy();
    delete global.window.fuel;
  }
  // Return the content proxy instance for cleaning
  return { contentProxy, backgroundService, destroy };
}
