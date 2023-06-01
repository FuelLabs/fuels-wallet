import { Fuel } from './Fuel';
import { MockConnection } from './__mock__/Fuel';

const fuel = new Fuel();

describe('Fuel Error', () => {
  beforeAll(() => {
    MockConnection.start(fuel);
  });

  test('fuel not detected', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeFalsy();
  });
});
