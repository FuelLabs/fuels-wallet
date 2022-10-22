import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';
import type { Account } from '../types';

import { IS_LOCKED_KEY, IS_LOGGED_KEY } from '~/config';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

type MachineContext = {
  wallet?: Wallet;
  data?: Account;
  error?: unknown;
};

type MachineServices = {
  fetchAccount: {
    data: Account;
  };
  unlock: {
    data: Wallet;
  };
};

type MachineEvents =
  | { type: 'UPDATE_ACCOUNT'; input?: null }
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] };

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
        tags: ['loading'],
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
      },
      unlocking: {
        tags: ['loading'],
        invoke: {
          src: 'unlock',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'done',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignWallet'],
              target: 'done',
            },
          ],
        },
      },
      done: {
        entry: ['setIsLocked'],
        after: {
          TIMEOUT: 'fetchingAccount', // retry
        },
      },
      failed: {
        after: {
          INTERVAL: 'fetchingAccount', // retry
        },
      },
    },
    on: {
      UPDATE_ACCOUNT: {
        target: 'fetchingAccount',
      },
      UNLOCK_WALLET: {
        target: 'unlocking',
      },
    },
  },
  {
    delays: { INTERVAL: 2000, TIMEOUT: 15000 },
    actions: {
      assignAccount: assign({
        data: (_, ev) => ev.data,
      }),
      assignWallet: assign({
        wallet: (_, ev) => ev.data,
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
      setIsLocked: (ctx) => {
        if (ctx.wallet) {
          localStorage.removeItem(IS_LOCKED_KEY);
        } else {
          localStorage.setItem(IS_LOCKED_KEY, 'true');
        }
      },
    },
    services: {
      fetchAccount: FetchMachine.create<never, Account>({
        showError: true,
        async fetch() {
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
      }),
      unlock: FetchMachine.create<AccountInputs['unlock'], Wallet>({
        showError: true,
        async fetch({ input }) {
          if (!input || !input?.password) {
            throw new Error('Invalid network input');
          }
          return AccountService.unlock(input);
        },
      }),
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
