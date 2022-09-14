import { interpret } from 'xstate';

import { accountsMachine } from './accountsMachine';

describe('accountsMachine', () => {
  it('should fetch accounts and balance initially', (done) => {
    const machine = accountsMachine
      .withContext({
        accounts: [],
      })
      .withConfig({
        services: {
          fetchAccounts: async () => {
            return [{ name: 'Account1', address: '0x00', publicKey: '0x00' }];
          },
          fetchBalances: async () => {
            return [
              {
                name: 'Account1',
                address: '0x00',
                publicKey: '0x00',
                balance: BigInt(0),
                balanceSymbol: '$',
                balances: [
                  {
                    amount: BigInt(100000),
                    assetId: '0x0000000000',
                  },
                ],
              },
            ];
          },
        },
      });

    const service = interpret(machine).onTransition((state) => {
      // this is after fetching accounts
      if (state.matches('fetchingBalances')) {
        const accounts = state.context?.accounts;
        expect(accounts?.length).toBe(1);
        expect(accounts?.[0].name).toBe('Account1');
        expect(accounts?.[0].balances).toBe(undefined);
      }

      // this is where you expect the state to eventually
      // be reached
      if (state.matches('done')) {
        const accounts = state.context?.accounts;
        expect(accounts?.length).toBe(1);
        expect(accounts?.[0].name).toBe('Account1');
        expect(accounts?.[0].balances?.[0].assetId).toBe('0x0000000000');
        done();
      }
    });

    service.start();
  });
});
