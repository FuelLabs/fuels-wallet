import { Fuel } from '../src';

describe('Fuel Error', () => {
  const fuel = new Fuel();

  test('fuel not detected', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeFalsy();
  });
});
