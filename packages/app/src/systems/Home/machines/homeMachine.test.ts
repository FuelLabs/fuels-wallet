import { interpret } from 'xstate';
import { ASSET_LIST } from '~/systems/Asset';

import { homeMachine } from './homeMachine';

describe('homeMachine', () => {
  const INITIAL_ACCOUNT = { name: 'Account1', address: '0x00', publicKey: '0x00' };
  const BALANCES = ASSET_LIST.map(({ assetId }) => ({
    assetId,
    amount: BigInt(10000000)
  }))

  it('should get balances initially', (done) => {
    const machine = homeMachine
      .withContext({
        account: null,
      })
      .withConfig({
        services: {
          getAccount: async () => {
            return INITIAL_ACCOUNT;
          },
          getBalances: async () => {
            return {
              ...INITIAL_ACCOUNT,
              balanceSymbol: '$',
              balance: BigInt(0),
              balances: BALANCES
            };
          },
        },
      });

    const service = interpret(machine).onTransition((state) => {
      // this is where you expect the state to eventually
      // be reached
      if (state.matches('idle')) {
        const account = state.context?.account;

        expect(account?.balance).toEqual(0n);

        // TODO: after we release new SDK version, we can test with JSON.stringify. Now we're blocked because of bigint
        expect(account?.balances?.length).toEqual(BALANCES.length);
        done();
      }
    });

    service.start();
  });
});
