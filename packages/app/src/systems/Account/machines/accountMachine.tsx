import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AccountService } from '../services/account';
import type { Account } from '../types';

import { IS_LOGGED_KEY } from '~/config';
import { NetworkService } from '~/systems/Network';

type MachineContext = {
  data?: Account;
  error?: unknown;
};

type MachineServices = {
  fetchAccount: {
    data: Account;
  };
};

type MachineEvents = { type: 'UPDATE_ACCOUNT' };

export const accountMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./accountMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetchingAccount',
    states: {
      fetchingAccount: {
        invoke: {
          src: 'fetchAccount',
          onDone: [
            {
              target: 'done',
              actions: ['assignAccount', 'setLocalStorage'],
              cond: 'hasAccount',
            },
            {
              actions: ['removeLocalStorage'],
              target: 'done',
            },
          ],
          onError: [
            {
              actions: 'assignError',
              target: 'failed',
            },
          ],
        },
        tags: 'loading',
      },
      done: {},
      failed: {},
    },
    on: {
      UPDATE_ACCOUNT: {
        target: 'fetchingAccount',
      },
    },
  },
  {
    actions: {
      assignAccount: assign({
        data: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      setLocalStorage: () => {
        localStorage.setItem(IS_LOGGED_KEY, 'true');
      },
      removeLocalStorage: () => {
        localStorage.removeItem(IS_LOGGED_KEY);
      },
    },
    services: {
      async fetchAccount() {
        const selectedNetwork = await NetworkService.getSelectedNetwork();
        const defaultProvider = import.meta.env.VITE_FUEL_PROVIDER_URL;
        const providerUrl = selectedNetwork?.url || defaultProvider;
        const accounts = await AccountService.getAccounts();
        const account = accounts[0];
        if (!account) {
          throw new Error('Account not found');
        }
        return AccountService.fetchBalance({ account, providerUrl });
      },
    },
    guards: {
      hasAccount: (ctx, ev) => {
        return Boolean(ctx?.data || ev?.data);
      },
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<typeof accountMachine>;
export type AccountMachineState = StateFrom<typeof accountMachine>;
