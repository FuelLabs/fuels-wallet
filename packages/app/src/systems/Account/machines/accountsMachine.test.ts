import { bn } from 'fuels';
import { interpret } from 'xstate';
import { Storage, db } from '~/systems/Core';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

import { MOCK_ACCOUNTS, createMockAccount } from '../__mocks__';
import { AccountService } from '../services';

import { graphql } from 'msw';
import { mockServer } from '~/mocks/server';
import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '~/systems/Transaction/__mocks__/transaction';
import type {
  AccountsMachineService,
  AccountsMachineEvents as MachineEvents,
} from './accountsMachine';
import { accountsMachine } from './accountsMachine';

const MOCK_ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

const MOCK_ACCOUNT_TWO = {
  ...MOCK_ACCOUNTS[1],
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

const machine = accountsMachine.withContext({}).withConfig({
  actions: {
    notifyUpdateAccounts() {},
    refreshApplication() {},
  },
});

mockServer([
  graphql.query('getChain', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
  graphql.query('getNodeInfo', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
  graphql.query('getBalances', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
]);

describe('accountsMachine', () => {
  let service: AccountsMachineService;
  let state: ReturnType<AccountsMachineService['getSnapshot']>;

  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNT });
    service = interpret(machine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  describe('list', () => {
    it('should fetch an initial account', async () => {
      state = await expectStateMatch(service, 'idle');
      expect(state.context.accounts?.length).toBe(1);
    });

    it('should fetch a list of accounts', async () => {
      state = await expectStateMatch(service, 'idle');
      // TODO refactor: change to service.send(addEvent) when it is added to the accountsMachine
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });
      const accounts = await AccountService.getAccounts();

      const idx = accounts.findIndex((account) => account.isCurrent);
      const invertIdx = idx === 0 ? 1 : 0;

      expect(accounts.length).toBe(2);
      expect(accounts[idx].isCurrent).toBeTruthy();
      expect(accounts[invertIdx].isCurrent).toBeFalsy();
    });
  });

  describe('select', () => {
    it('should be able to select a new account', async () => {
      state = await expectStateMatch(service, 'idle');
      // TODO refactor: change to service.send(addEvent) when it is added to the accountsMachine
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });
      let accounts = await AccountService.getAccounts();

      const idx = accounts.findIndex((account) => account.isCurrent);
      const invertIdx = idx === 0 ? 1 : 0;

      expect(accounts.length).toBe(2);
      expect(accounts[idx].isCurrent).toBeTruthy();
      expect(accounts[invertIdx].isCurrent).toBeFalsy();

      const selectEv: MachineEvents = {
        type: 'SET_CURRENT_ACCOUNT',
        input: { address: accounts[invertIdx].address },
      };

      const nextState = service.nextState(selectEv);
      expect(nextState.value).toBe('settingCurrentAccount');

      service.send(selectEv);
      await expectStateMatch(service, 'settingCurrentAccount');
      state = await expectStateMatch(service, 'idle');

      accounts = await AccountService.getAccounts();

      expect(accounts[idx].isCurrent).toBeFalsy();
      expect(accounts[invertIdx].isCurrent).toBeTruthy();
    });
  });

  describe('hide', () => {
    it('should hide an account', async () => {
      state = await expectStateMatch(service, 'idle');

      let accounts = await AccountService.getAccounts();
      expect(accounts[0].isHidden).toBeFalsy();

      const toggleHideEv: MachineEvents = {
        type: 'TOGGLE_HIDE_ACCOUNT',
        input: { address: accounts[0].address, data: { isHidden: true } },
      };

      service.send(toggleHideEv);
      state = await expectStateMatch(service, 'idle');

      accounts = await AccountService.getAccounts();
      expect(accounts[0].isHidden).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('logout should clean indexdb and localstorage', async () => {
      await createMockAccount();
      const DatabaseMock = jest.spyOn(db, 'clear').mockImplementation();
      const StorageClearMock = jest
        .spyOn(Storage, 'clear')
        .mockImplementation();

      // Execute logout
      service.send('LOGOUT');
      await expectStateMatch(service, 'idle');

      expect(DatabaseMock).toBeCalledTimes(1);
      expect(StorageClearMock).toBeCalledTimes(1);
    });
  });
});
