import { bn } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { accountMachine } from './accountMachine';

type Service = InterpreterFrom<typeof accountMachine>;

const MOCK_ACCOUNT = {
  name: 'Account1',
  address: '0x00',
  publicKey: '0x00',
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

describe('accountsMachine', () => {
  let service: Service;

  beforeEach(() => {
    const machine = accountMachine.withContext({}).withConfig({
      services: {
        async fetchAccount() {
          return MOCK_ACCOUNT;
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
    const { data } = state.context;
    expect(data).toEqual(MOCK_ACCOUNT);
  });
});
