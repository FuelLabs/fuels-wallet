import type { AccountWithBalance } from '@fuel-wallet/types';
import { interpret } from 'xstate';
import { CONSOLIDATION_CHECKED_KEY } from '~/config';
import { store } from '~/store';
import { MOCK_ACCOUNTS } from '~/systems/Account/__mocks__/accounts';
import { Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { AccountService } from '../services/account';
import type { AccountsMachineService } from './accountsMachine';
import { accountsMachine } from './accountsMachine';

const ONE_MINUTE = 60_000;
const account = { ...MOCK_ACCOUNTS[0], isCurrent: true };
const accountWithBalance = {
  ...account,
  balance: '0',
  balanceSymbol: '$',
  balances: [],
} as unknown as AccountWithBalance;

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  });
}

describe('accountsMachine', () => {
  let service: AccountsMachineService;
  let fetchBalance: jest.SpyInstance;
  let recoverWallet: jest.SpyInstance;
  let fetchRecoveryState: jest.SpyInstance;
  let refreshConsolidateCoins: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    setVisibility('visible');
    jest.spyOn(AccountService, 'getAccounts').mockResolvedValue([account]);
    fetchRecoveryState = jest
      .spyOn(AccountService, 'fetchRecoveryState')
      // biome-ignore lint/suspicious/noExplicitAny: test mock
      .mockResolvedValue({ needsRecovery: false } as any);
    recoverWallet = jest
      .spyOn(AccountService, 'recoverWallet')
      .mockResolvedValue(undefined);
    jest.spyOn(AccountService, 'getCurrentAccount').mockResolvedValue(account);
    jest
      .spyOn(NetworkService, 'getSelectedNetwork')
      // biome-ignore lint/suspicious/noExplicitAny: test mock
      .mockResolvedValue({ url: 'http://localhost:4000/v1/graphql' } as any);
    fetchBalance = jest
      .spyOn(AccountService, 'fetchBalance')
      .mockResolvedValue(accountWithBalance);

    refreshConsolidateCoins = jest
      .spyOn(store, 'refreshConsolidateCoins')
      .mockImplementation(() => {});
    service = interpret(accountsMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('fetches balances at most once per 15 s while the popup is idle', async () => {
    await jest.advanceTimersByTimeAsync(0);
    expect(service.getSnapshot().matches('idle')).toBe(true);
    fetchBalance.mockClear();

    await jest.advanceTimersByTimeAsync(ONE_MINUTE);
    const perMinute = fetchBalance.mock.calls.length;
    console.info(`fetchBalance calls per idle minute: ${perMinute}`);
    expect(perMinute).toBeGreaterThan(0);
    expect(perMinute).toBeLessThanOrEqual(ONE_MINUTE / 15_000);
  });

  it('asks for a consolidation check only when balances change', async () => {
    const changed = () => refreshConsolidateCoins.mock.calls.length;

    await jest.advanceTimersByTimeAsync(0);
    expect(changed()).toBe(1);

    await jest.advanceTimersByTimeAsync(ONE_MINUTE);
    expect(changed()).toBe(1);

    fetchBalance.mockResolvedValue({
      ...accountWithBalance,
      balances: [{ assetId: '0x01', amount: '10' }],
    });
    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    expect(changed()).toBe(2);
  });

  it('does not refresh in the background while the document is hidden', async () => {
    await jest.advanceTimersByTimeAsync(0);
    fetchBalance.mockClear();
    setVisibility('hidden');

    await jest.advanceTimersByTimeAsync(ONE_MINUTE);
    expect(fetchBalance).not.toHaveBeenCalled();

    setVisibility('visible');
    await jest.advanceTimersByTimeAsync(20_000);
    expect(fetchBalance).toHaveBeenCalledTimes(1);
  });

  it('skips the consolidation check when a previous popup checked the same balances', async () => {
    await jest.advanceTimersByTimeAsync(0);
    const [[input]] = refreshConsolidateCoins.mock.calls;
    service.stop();
    refreshConsolidateCoins.mockClear();

    Storage.setItem(CONSOLIDATION_CHECKED_KEY, input.balancesKey);
    service = interpret(accountsMachine.withContext({})).start();
    await jest.advanceTimersByTimeAsync(0);
    expect(refreshConsolidateCoins).not.toHaveBeenCalled();
    Storage.removeItem(CONSOLIDATION_CHECKED_KEY);
  });

  it('refreshes immediately on REFRESH_ACCOUNTS', async () => {
    await jest.advanceTimersByTimeAsync(0);
    fetchBalance.mockClear();

    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    expect(fetchBalance).toHaveBeenCalledTimes(1);
  });

  it('only recovers the wallet when recovery is needed', async () => {
    await jest.advanceTimersByTimeAsync(ONE_MINUTE);
    expect(recoverWallet).not.toHaveBeenCalled();

    // biome-ignore lint/suspicious/noExplicitAny: test mock
    fetchRecoveryState.mockResolvedValue({ needsRecovery: true } as any);
    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    expect(recoverWallet).toHaveBeenCalledTimes(1);
  });

  it('keeps context references when a refresh returns equal data', async () => {
    jest
      .spyOn(AccountService, 'getAccounts')
      .mockImplementation(async () => [{ ...account }]);
    fetchBalance.mockImplementation(async () => ({ ...accountWithBalance }));
    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    const before = service.getSnapshot().context;

    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    const after = service.getSnapshot().context;
    expect(after.accounts).toBe(before.accounts);
    expect(after.account).toBe(before.account);

    fetchBalance.mockImplementation(async () => ({
      ...accountWithBalance,
      balance: '1',
    }));
    service.send({ type: 'REFRESH_ACCOUNTS', input: { skipLoading: true } });
    await jest.advanceTimersByTimeAsync(0);
    expect(service.getSnapshot().context.account).not.toBe(before.account);
  });
});
