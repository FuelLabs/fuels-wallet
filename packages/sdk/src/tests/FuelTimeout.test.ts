import { Fuel } from '../Fuel';

import { cleanFuelMocks, mockFuel } from './__mock__';

import './__mock__/MockConnections';

describe('Fuel Timeout', () => {
  afterEach(() => {
    cleanFuelMocks();
  });

  test('hasWallet with timeout', async () => {
    const fuel = new Fuel();

    // Inject `fuel` on `window` after 500ms
    setTimeout(() => {
      mockFuel({ name: 'Fuel Wallet' });
    }, 500);

    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeTruthy();
  });

  test('Should be able to connect if Wallet changes to ready', async () => {
    const fuel = new Fuel();

    // Should fail first as fuel is not detected
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeFalsy();

    const onReadyChange = jest.fn();
    fuel.on(fuel.events.load, onReadyChange);
    mockFuel({ name: 'Fuel Wallet' });
    expect(onReadyChange).toBeCalledTimes(1);

    // Should pass as fuel is detected
    const hasWallet2 = await fuel.hasWallet();
    expect(hasWallet2).toBeTruthy();
  });
});
