import { bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { AccountsMachineService } from './accountsMachine';
import { accountsMachine } from './accountsMachine';

const MOCK_ACCOUNT = { name: 'Account1', address: '0x00', publicKey: '0x00' };
const MOCK_ACCOUNT_WITH_BALANCE = {
  ...MOCK_ACCOUNT,
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

describe('accountsMachine', () => {
  let service: AccountsMachineService;

  beforeEach(() => {
    const machine = accountsMachine.withContext({ accounts: {} }).withConfig({
      services: {
        async fetchAccounts() {
          return [MOCK_ACCOUNT];
        },
        async fetchBalance() {
          return MOCK_ACCOUNT_WITH_BALANCE;
        },
      },
    });

    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should have just one account added', async () => {
    const state = await waitFor(service, (state) => state.matches('done'));
    const { account, accounts } = state.context;
    const accountsArr = Object.values(accounts || {});
    expect(accountsArr?.length).toBe(1);
    expect(accountsArr[0].name).toBe('Account1');
    expect(accountsArr[0].balances).toBe(MOCK_ACCOUNT_WITH_BALANCE.balances);
    expect(accountsArr[0]).toEqual(account);
    expect(account).toEqual(MOCK_ACCOUNT_WITH_BALANCE);
  });
});
