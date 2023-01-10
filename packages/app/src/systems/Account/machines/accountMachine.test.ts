import { bn } from 'fuels';
import { interpret } from 'xstate';

import { createMockAccount, MOCK_ACCOUNTS } from '../__mocks__';
import { AccountService, UnlockService } from '../services';

import type { AccountMachineService, MachineEvents } from './accountMachine';
import { accountMachine } from './accountMachine';

import { expectStateMatch } from '~/systems/Core/__tests__/utils';
import { NetworkService } from '~/systems/Network';

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
  },
});

describe('accountsMachine', () => {
  let service: AccountMachineService;
  let state: ReturnType<AccountMachineService['getSnapshot']>;

  beforeEach(async () => {
    const mockAccount = await createMockAccount();
    await NetworkService.clearNetworks();
    await NetworkService.addFirstNetwork();
    const { manager, wallet } = await AccountService.unlock(mockAccount);
    jest.spyOn(UnlockService, 'getWalletUnlocked').mockResolvedValue(wallet);
    jest.spyOn(UnlockService, 'getManagerUnlocked').mockResolvedValue(manager);
    service = interpret(machine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
    jest.clearAllMocks();
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
      await expectStateMatch(service, 'idle');

      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });

      await expectStateMatch(service, 'addingAccount');
      await expectStateMatch(service, 'fetchingAccounts');
      await expectStateMatch(service, 'idle');
    });

    it('should not be able to add accounts with same name', async () => {
      await expectStateMatch(service, 'idle');
      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });
      await expectStateMatch(service, 'addingAccount');
      await expectStateMatch(service, 'fetchingAccounts');
      await expectStateMatch(service, 'idle');
      service.send('ADD_ACCOUNT', {
        input: 'Account Go',
      });

      // make sure test fails but jest don't stop
      jest.spyOn(console, 'error').mockImplementation();
      await expectStateMatch(service, 'failed');
    });
  });
});
