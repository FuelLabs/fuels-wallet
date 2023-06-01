import { Fuel } from './Fuel';
import { MockConnection } from './__mock__/Fuel';

const fuel = new Fuel();

describe('Fuel Timeout', () => {
  beforeAll(() => {
    // Inject `fuel` on `window` after 500ms
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.fuel = fuel;
    }, 500);

    MockConnection.start(fuel);
  });

  test('hasWallet with timeout', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeTruthy();
  });
});
