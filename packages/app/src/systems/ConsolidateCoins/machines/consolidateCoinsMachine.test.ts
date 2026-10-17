import { interpret } from 'xstate';
import { CONSOLIDATION_CHECKED_KEY } from '~/config';
import { Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { consolidateCoinsMachine } from './consolidateCoinsMachine';

describe('consolidateCoinsMachine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Storage.removeItem(CONSOLIDATION_CHECKED_KEY);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('waits for REFRESH before checking consolidation', async () => {
    const getSelectedNetwork = jest
      .spyOn(NetworkService, 'getSelectedNetwork')
      .mockRejectedValue(new Error('No network selected'));
    const service = interpret(consolidateCoinsMachine).start();

    await jest.advanceTimersByTimeAsync(60_000);
    expect(getSelectedNetwork).not.toHaveBeenCalled();

    service.send({ type: 'REFRESH' });
    await jest.advanceTimersByTimeAsync(0);
    expect(getSelectedNetwork).toHaveBeenCalledTimes(1);
    expect(service.getSnapshot().matches('idle')).toBe(true);
    service.stop();
  });

  it('remembers balances that need no consolidation', async () => {
    const KEY = 'http://localhost:4000/v1/graphql|0x01|0x00:100';
    const run = async (shouldConsolidate: boolean, balancesKey = KEY) => {
      const service = interpret(
        consolidateCoinsMachine.withConfig({
          services: {
            getProviderUrl: async () => 'http://localhost:4000/v1/graphql',
            getBaseAssetId: async () => '0x00',
            // biome-ignore lint/suspicious/noExplicitAny: test mock
            getAccount: async () => ({ address: '0x01' }) as any,
            shouldConsolidate: async () => shouldConsolidate,
            getAllCoins: async () => [],
            createConsolidation: () => new Promise(() => {}),
          },
        })
      ).start();
      service.send({ type: 'REFRESH', input: { balancesKey } });
      await jest.advanceTimersByTimeAsync(0);
      service.stop();
    };

    await run(false);
    expect(Storage.getItem(CONSOLIDATION_CHECKED_KEY)).toBe(KEY);

    await run(true);
    expect(Storage.getItem(CONSOLIDATION_CHECKED_KEY)).toBeNull();
  });

  it('does not remember a key for another account or network', async () => {
    const service = interpret(
      consolidateCoinsMachine.withConfig({
        services: {
          getProviderUrl: async () => 'http://localhost:4000/v1/graphql',
          getBaseAssetId: async () => '0x00',
          // biome-ignore lint/suspicious/noExplicitAny: test mock
          getAccount: async () => ({ address: '0x02' }) as any,
          shouldConsolidate: async () => false,
          getAllCoins: async () => [],
          createConsolidation: () => new Promise(() => {}),
        },
      })
    ).start();
    service.send({
      type: 'REFRESH',
      input: { balancesKey: 'http://localhost:4000/v1/graphql|0x01|0x00:100' },
    });
    await jest.advanceTimersByTimeAsync(0);
    service.stop();
    expect(Storage.getItem(CONSOLIDATION_CHECKED_KEY)).toBeNull();
  });
});
