import { Fuel } from '../Fuel';

import './__mock__/MockConnections';

describe('Fuel Timeout', () => {
  const fuel = new Fuel();

  beforeAll(() => {
    // Inject `fuel` on `window` after 500ms
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.fuel = fuel;
    }, 500);
  });

  test('hasWallet with timeout', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeTruthy();
  });
});
