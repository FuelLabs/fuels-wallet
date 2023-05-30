import { Fuel } from './Fuel';
import { MockConnection } from './__mock__/Fuel';

const fuel = new Fuel();

describe('Fuel Error', () => {
  beforeAll(() => {
    MockConnection.start(fuel);
  });

  test('fuel not detected', async () => {
    try {
      await fuel.isConnected();
    } catch (e: unknown) {
      expect((e as Error).message).toEqual('fuel not detected on the window!');
    }
  });
});
