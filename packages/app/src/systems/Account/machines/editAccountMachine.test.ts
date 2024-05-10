import { bn } from 'fuels';
import { interpret } from 'xstate';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

import { MOCK_ACCOUNTS } from '../__mocks__';
import { AccountService } from '../services';

import { graphql } from 'msw';
import { mockServer } from '~/mocks/server';
import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '~/systems/Transaction/__mocks__/transaction';
import type {
  EditAccountMachineService,
  EditAccountMachineEvents as MachineEvents,
} from './editAccountMachine';
import { editAccountMachine } from './editAccountMachine';

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

const machine = editAccountMachine.withContext({}).withConfig({
  actions: {
    notifyUpdateAccounts() {},
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

describe('editAccountMachine', () => {
  let service: EditAccountMachineService;

  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNT });
    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
  });

  describe('edit', () => {
    it('should be able to edit an account name', async () => {
      const name = 'Test 1';
      await expectStateMatch(service, 'idle');
      let accounts = await AccountService.getAccounts();
      expect(accounts?.[0].name).toBe(MOCK_ACCOUNT.name);

      const updateAccountNameEv: MachineEvents = {
        type: 'UPDATE_ACCOUNT',
        input: { address: MOCK_ACCOUNT.address, data: { name } },
      };

      const nextState = service.nextState(updateAccountNameEv);
      expect(nextState.value).toBe('updatingAccount');

      service.send(updateAccountNameEv);
      await expectStateMatch(service, 'updatingAccount');
      await expectStateMatch(service, 'idle');

      accounts = await AccountService.getAccounts();
      expect(accounts?.[0].name).toBe(name);
    });

    it('should not be able to edit an account with existing name', async () => {
      await expectStateMatch(service, 'idle');
      // TODO refactor: change to service.send(addEvent) when it is added to the accountsMachine
      await AccountService.addAccount({ data: MOCK_ACCOUNT_TWO });

      const accounts = await AccountService.getAccounts();
      expect(accounts.length).toBe(2);

      const updateAccountNameEv: MachineEvents = {
        type: 'UPDATE_ACCOUNT',
        input: {
          address: MOCK_ACCOUNT.address,
          data: { name: MOCK_ACCOUNT_TWO.name },
        },
      };

      service.send(updateAccountNameEv);

      // make sure test fails but jest don't stop
      jest.spyOn(console, 'error').mockImplementation();

      await expectStateMatch(service, 'failed');
    });
  });
});
