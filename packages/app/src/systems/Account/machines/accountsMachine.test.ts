import { interpret } from 'xstate';

import { accountsMachine } from './accountsMachine';

describe('accountsMachine', () => {
  it('should fetch accounts initially', (done) => {
    const machine = accountsMachine
      .withContext({
        accounts: [],
      })
      .withConfig({
        services: {
          fetchAccounts: async () => {
            return [{ name: 'Account1', address: '0x00' }];
          },
        },
      });

    const service = interpret(machine).onTransition((state) => {
      if (state.matches('done')) {
        const accounts = state.context?.accounts;
        expect(accounts?.length).toBe(1);
        expect(accounts?.[0].name).toBe('Account1');
        done();
      }
    });

    service.start();
  });
});
