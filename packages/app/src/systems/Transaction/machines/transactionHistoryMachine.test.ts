import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import NameSystemService from '~/systems/NameSystem/services/nameSystem';
import { NetworkService } from '~/systems/Network/services/network';
import { TxService } from '../services';
import type { TransactionResultWithDomain } from '../types';
import { clearDomainCache } from '../utils/enrichDomains';
import { transactionHistoryMachine } from './transactionHistoryMachine';

const OWNER = `0x${'1'.repeat(64)}`;
const RECIPIENT_A = `0x${'a'.repeat(64)}`;
const RECIPIENT_B = `0x${'b'.repeat(64)}`;

const tx = (id: string, to: string) =>
  ({
    id,
    operations: [{ to: { address: to } }],
  }) as unknown as TransactionResultWithDomain;

function mockPage(
  txs: TransactionResultWithDomain[],
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
) {
  return { transactionHistory: txs, pageInfo } as unknown as Awaited<
    ReturnType<typeof TxService.getTransactionHistory>
  >;
}

describe('transactionHistoryMachine', () => {
  let getHistory: jest.SpyInstance;
  let resolveNames: jest.SpyInstance;

  beforeEach(() => {
    clearDomainCache();
    jest
      .spyOn(NetworkService, 'getSelectedNetwork')
      .mockResolvedValue({ id: '1', url: 'http://node', chainId: 0 } as never);
    getHistory = jest.spyOn(TxService, 'getTransactionHistory');
    resolveNames = jest
      .spyOn(NameSystemService, 'resolverAddresses')
      .mockImplementation(async ({ addresses }) => ({
        domains: addresses
          .filter((a) => a === RECIPIENT_A)
          .map((a) => ({ resolver: a, name: 'alice' })) as never,
        error: null,
      }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the first page after one request and paginates on demand', async () => {
    getHistory
      .mockResolvedValueOnce(
        mockPage([tx('3', RECIPIENT_A), tx('2', RECIPIENT_B)], {
          hasNextPage: true,
          endCursor: 'cursor-2',
        })
      )
      .mockResolvedValueOnce(
        mockPage([tx('1', RECIPIENT_A)], {
          hasNextPage: false,
          endCursor: 'cursor-1',
        })
      );

    const service = interpret(transactionHistoryMachine).start();
    service.send('GET_TRANSACTION_HISTORY', { input: { address: OWNER } });

    let state = await waitFor(service, (s) => s.matches('idle'));
    expect(getHistory).toHaveBeenCalledTimes(1);
    expect(getHistory.mock.calls[0][0].pagination).toBeUndefined();
    expect(state.context.transactionHistory?.map((t) => t.id)).toEqual([
      '3',
      '2',
    ]);
    expect(state.context.transactionHistory?.[0].operations[0].to?.domain).toBe(
      '@alice'
    );
    expect(state.context.hasNextPage).toBe(true);

    service.send('FETCH_NEXT_PAGE');
    state = await waitFor(
      service,
      (s) => s.matches('idle') && s.context.transactionHistory?.length === 3
    );
    expect(getHistory).toHaveBeenCalledTimes(2);
    expect(getHistory.mock.calls[1][0].pagination).toEqual({
      before: 'cursor-2',
    });
    expect(state.context.transactionHistory?.map((t) => t.id)).toEqual([
      '3',
      '2',
      '1',
    ]);
    // Both recipients were cached by the first page
    expect(resolveNames).toHaveBeenCalledTimes(1);

    service.send('FETCH_NEXT_PAGE');
    expect(service.getSnapshot().matches('idle')).toBe(true);
    expect(getHistory).toHaveBeenCalledTimes(2);

    service.stop();
  });

  it('retries domain lookups that failed', async () => {
    resolveNames.mockResolvedValueOnce({ domains: null, error: 'down' });
    getHistory.mockResolvedValue(
      mockPage([tx('1', RECIPIENT_A)], { hasNextPage: false, endCursor: null })
    );

    const service = interpret(transactionHistoryMachine).start();
    service.send('GET_TRANSACTION_HISTORY', { input: { address: OWNER } });
    let state = await waitFor(service, (s) => s.matches('idle'));
    expect(state.context.transactionHistory?.[0].operations[0].to?.domain).toBe(
      null
    );

    service.send('GET_TRANSACTION_HISTORY', { input: { address: OWNER } });
    state = await waitFor(
      service,
      (s) => s.matches('idle') && resolveNames.mock.calls.length === 2
    );
    expect(state.context.transactionHistory?.[0].operations[0].to?.domain).toBe(
      '@alice'
    );
    service.stop();
  });
});
