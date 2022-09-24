import { bn } from 'fuels';
import { interpret } from 'xstate';

import { accountsMachine } from './accountsMachine';

const MOCK_ACCOUNT = { name: 'Account1', address: '0x00', publicKey: '0x00' };
const MOCK_ACCOUNT_WITH_BALANCE = {
  ...MOCK_ACCOUNT,
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

describe('accountsMachine', () => {
  it('should fetch accounts and balance initially', (done) => {
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

    const service = interpret(machine).onTransition((state) => {
      // this is after fetching accounts
      if (state.matches('fetchingBalances')) {
        const accounts = Object.values(state.context?.accounts || {});
        expect(accounts.length).toBe(1);
        expect(accounts[0].name).toBe('Account1');
        expect(accounts[0].balances).toBe(undefined);
      }

      // this is where you expect the state to eventually
      // be reached
      if (state.matches('done') || state.matches('failed')) {
        const { accounts, account } = state.context;
        const accountsArr = Object.values(accounts || {});
        expect(accountsArr[0]).toEqual(account);
        expect(account).toEqual(MOCK_ACCOUNT_WITH_BALANCE);
        done();
      }
    });

    service.start();
  });
});
