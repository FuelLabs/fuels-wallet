import type { Fuel } from '../Fuel';

import type { MockServices } from './__mock__';
import { mockFuel } from './__mock__';

describe('Fuel Connectors', () => {
  let mocksConnector1: MockServices;
  let mocksConnector2: MockServices;
  let fuel: Fuel;

  beforeAll(() => {
    mocksConnector1 = mockFuel();
    mocksConnector2 = mockFuel({ name: 'Third Wallet' });
    fuel = window.fuel!;
  });

  afterAll(() => {
    mocksConnector1.destroy();
    mocksConnector2.destroy();
  });

  test('listConnectors', () => {
    const connectors = fuel.listConnectors();
    expect(connectors.map((c) => c.name)).toEqual([
      'Fuel Wallet',
      'Third Wallet',
    ]);
  });

  test('hasConnector', () => {
    expect(fuel.hasConnector('Fuel Wallet')).toBeTruthy();
    expect(fuel.hasConnector('Third Wallet')).toBeTruthy();
  });

  test('Fuel Wallet should be the default connector', async () => {
    expect(fuel.connectorName).toEqual('Fuel Wallet');
  });

  test('selectConnector', async () => {
    expect(await fuel.selectConnector('Fuel Wallet')).toBeTruthy();
    expect(await fuel.selectConnector('Third Wallet')).toBeTruthy();
  });

  test('selectConnector that is not install should throw a Error', async () => {
    const connectorName = 'Another Wallet';
    fuel.addConnector({ name: connectorName });
    const connectors = fuel.listConnectors();
    expect(connectors.find((i) => i.name === connectorName)).toBeTruthy();
    expect(fuel.selectConnector(connectorName)).rejects.toThrow(
      `"${connectorName}" connector not found!`
    );
  });

  test('removeConnector', async () => {
    const connectorName = 'Another Wallet';
    expect(
      fuel.listConnectors().find((i) => i.name === connectorName)
    ).toBeTruthy();
    fuel.removeConnector(connectorName);
    expect(
      fuel.listConnectors().find((i) => i.name === connectorName)
    ).toBeFalsy();
  });

  test('addConnector', async () => {
    const connectorName = 'Second Wallet';
    fuel.addConnector({ name: connectorName });
    expect(fuel.hasConnector(connectorName)).toBeTruthy();
  });

  test('Message should go to the correct Connector', async () => {
    // Change the state of the second connector
    mocksConnector2.backgroundService.state.isConnected = false;

    const hasConnector = await fuel.selectConnector('Fuel Wallet');
    expect(hasConnector).toBeTruthy();
    const isConnected = await fuel.isConnected();
    expect(isConnected).toBeTruthy();
    const hasConnector2 = await fuel.selectConnector('Third Wallet');
    expect(hasConnector2).toBeTruthy();
    const isConnected2 = await fuel.isConnected();
    expect(isConnected2).toBeFalsy();

    // Change the state back of the second connector
    mocksConnector2.backgroundService.state.isConnected = true;
  });
});

describe('Fuel Connectors Events', () => {
  let mocksConnector1: MockServices;
  let mocksConnector2: MockServices;
  let fuel: Fuel;

  beforeAll(() => {
    mocksConnector1 = mockFuel();
    mocksConnector2 = mockFuel({ name: 'Third Wallet' });
    fuel = window.fuel!;
  });

  afterAll(() => {
    mocksConnector1.destroy();
    mocksConnector2.destroy();
  });

  test('Event: Connector Added', async () => {
    const handleConnectorEvent = jest.fn();
    fuel.on(fuel.events.connectors, handleConnectorEvent);
    const walletConnector = { name: 'Another Connector' };
    fuel.addConnector(walletConnector);
    expect(handleConnectorEvent).toBeCalledWith(fuel.listConnectors());
  });

  test('Event: Current Connector Change', async () => {
    const handleConnectorChangeEvent = jest.fn();
    fuel.on(fuel.events.currentConnector, handleConnectorChangeEvent);
    await fuel.selectConnector('Third Wallet');
    expect(handleConnectorChangeEvent).toBeCalledWith({ name: 'Third Wallet' });
  });
});
