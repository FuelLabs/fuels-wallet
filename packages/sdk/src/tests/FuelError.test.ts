import { Fuel } from '../Fuel';

import './__mock__/MockConnections';

describe('Fuel Error', () => {
  const fuel = new Fuel({ name: 'Fuel Wallet' });

  test('fuel not detected', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeFalsy();
  });
});
