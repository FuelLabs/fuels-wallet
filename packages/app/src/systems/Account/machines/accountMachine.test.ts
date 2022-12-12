import { bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { MOCK_ACCOUNTS } from '../__mocks__';
import { AccountService } from '../services';

import type { AccountMachineService } from './accountMachine';
import { accountMachine, AccountScreen } from './accountMachine';

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

const machine = accountMachine.withContext({}).withConfig({
  actions: {
    redirectToHome() {},
  },
});

describe('accountsMachine', () => {
  let service: AccountMachineService;
  let state: ReturnType<AccountMachineService['getSnapshot']>;

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
    const initialEv: any = {
      type: 'SET_INITIAL_DATA',
      input: { type: AccountScreen.list },
    };

    it('should fetch a list of accounts', async () => {
      const nextState = service.nextState(initialEv);
      expect(nextState.value).toBe('fetchingAccounts');

      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('done'));
      expect(state.context.accounts?.length).toBe(1);
    });

    it('should not have any account selected in context', async () => {
      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('done'));
      expect(state.context.account).toBeFalsy();
    });
  });

  describe('select', () => {
    const initialEv: any = {
      type: 'SET_INITIAL_DATA',
      input: { type: AccountScreen.list },
    };

    it('should be able to select a new network', async () => {
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });

      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('done'));
      let accounts = state.context.accounts || [];
      const idx = accounts.findIndex((account) => account.isSelected);
      const invertIdx = idx === 0 ? 1 : 0;
      expect(accounts.length).toBe(2);
      expect(accounts[idx].isSelected).toBeTruthy();
      expect(accounts[invertIdx].isSelected).toBeFalsy();

      const selectEv: any = {
        type: 'SELECT_ACCOUNT',
        input: { address: accounts[invertIdx].address },
      };

      const nextState = service.nextState(selectEv);
      expect(nextState.value).toBe('selectingAccount');

      service.send(selectEv);
      await waitFor(service, (state) => state.matches('selectingAccount'));
      state = await waitFor(service, (state) => state.matches('done'));
      accounts = state.context.accounts || [];
      expect(accounts[idx].isSelected).toBeFalsy();
      expect(accounts[invertIdx].isSelected).toBeTruthy();
    });
  });
});
