import { bn } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { MOCK_ACCOUNTS } from '../__mocks__';

import { accountMachine, AccountScreen } from './accountMachine';

type Service = InterpreterFrom<typeof accountMachine>;

const MOCK_ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

describe('accountsMachine', () => {
  let service: Service;

  beforeEach(() => {
    const machine = accountMachine.withContext({}).withConfig({
      services: {
        async fetchAccounts() {
          return MOCK_ACCOUNTS;
        },
      },
      actions: {
        redirectToHome() {},
      },
    });

    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
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
      const state = await waitFor(service, (state) => state.matches('done'));
      expect(state.context.accounts?.length).toBe(3);
    });
  });

  it('should have just one account added', async () => {
    const state = await waitFor(service, (state) => state.matches('done'));
    console.log('here ', state.context);
    const { account } = state.context;
    expect(account).toEqual(MOCK_ACCOUNT);
  });

  it('should should poll the account info', async () => {
    jest.useFakeTimers();
    const state = await waitFor(service, (state) => state.matches('done'));
    const { account } = state.context;
    expect(account).toEqual(MOCK_ACCOUNT);
    jest.advanceTimersByTime(15000);
    const { matches } = await waitFor(service, (state) =>
      state.matches('fetchingAccounts')
    );
    expect(matches('fetchingAccounts')).toBeTruthy();
  });
});
