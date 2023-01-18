import { bn } from 'fuels';
import { interpret } from 'xstate';

import { MOCK_ACCOUNTS, createMockAccount } from '../__mocks__';
import { AccountService } from '../services';

import type { AccountMachineService, MachineEvents } from './accountMachine';
import { accountMachine } from './accountMachine';

import { db, Storage } from '~/systems/Core';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

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
    notifyUpdateAccounts() {},
    redirectToHome() {},
    refreshApplication() {},
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
    it('should fetch an initial account', async () => {
      state = await expectStateMatch(service, 'idle');
      expect(state.context.accounts?.length).toBe(1);
    });

    it('should fetch a list of accounts', async () => {
      state = await expectStateMatch(service, 'idle');
      // TODO refactor: change to service.send(addEvent) when it is added to the accountMachine
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });
      const accounts = await AccountService.getAccounts();

      const idx = accounts.findIndex((account) => account.isSelected);
      const invertIdx = idx === 0 ? 1 : 0;

      expect(accounts.length).toBe(2);
      expect(accounts[idx].isSelected).toBeTruthy();
      expect(accounts[invertIdx].isSelected).toBeFalsy();
    });
  });

  describe('select', () => {
    it('should be able to select a new account', async () => {
      state = await expectStateMatch(service, 'idle');
      // TODO refactor: change to service.send(addEvent) when it is added to the accountMachine
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });
      let accounts = await AccountService.getAccounts();

      const idx = accounts.findIndex((account) => account.isSelected);
      const invertIdx = idx === 0 ? 1 : 0;

      expect(accounts.length).toBe(2);
      expect(accounts[idx].isSelected).toBeTruthy();
      expect(accounts[invertIdx].isSelected).toBeFalsy();

      const selectEv: MachineEvents = {
        type: 'SELECT_ACCOUNT',
        input: { address: accounts[invertIdx].address },
      };

      const nextState = service.nextState(selectEv);
      expect(nextState.value).toBe('selectingAccount');

      service.send(selectEv);
      await expectStateMatch(service, 'selectingAccount');
      state = await expectStateMatch(service, 'idle');

      accounts = await AccountService.getAccounts();

      expect(accounts[idx].isSelected).toBeFalsy();
      expect(accounts[invertIdx].isSelected).toBeTruthy();
    });
  });

  describe('add', () => {
    it('should be able to add an account', async () => {
      const { password } = await createMockAccount();
      await expectStateMatch(service, 'idle');

      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });
      await expectStateMatch(service, 'unlocking');
      service.send('UNLOCK_VAULT', {
        input: {
          password,
        },
      });
      await expectStateMatch(service, 'addingAccount');
      await expectStateMatch(service, 'fetchingAccounts');
      await expectStateMatch(service, 'idle');
    });

    it('should not be able to add accounts with same name', async () => {
      const { password } = await createMockAccount();
      await expectStateMatch(service, 'idle');
      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });
      await expectStateMatch(service, 'unlocking');
      service.send('UNLOCK_VAULT', {
        input: {
          password,
        },
      });
      await expectStateMatch(service, 'addingAccount');
      await expectStateMatch(service, 'fetchingAccounts');
      await expectStateMatch(service, 'idle');
      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });

      // make sure test fails but jest don't stop
      jest.spyOn(console, 'error').mockImplementation();

      await expectStateMatch(service, 'unlocking');
      service.send('UNLOCK_VAULT', {
        input: {
          password,
        },
      });
      await expectStateMatch(service, 'failed');
    });

    it('logout should clean indexdb and localstorage', async () => {
      await createMockAccount();

      // Check if indexdb is not empty
      const accountsBefore = await AccountService.getAccounts();
      expect(accountsBefore.length).toBeGreaterThanOrEqual(1);

      // Execute logout
      await expectStateMatch(service, 'idle');
      service.send('LOGOUT');
      await db.open();

      // Check if indexdb is empty
      const accountsAfter = await AccountService.getAccounts();
      const isLogged = Storage.getItem('isLogged');
      expect(accountsAfter.length).toBe(0);
      expect(isLogged).toBe(null);
    });
  });
});
