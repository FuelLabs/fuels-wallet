import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import { FetchMachine } from '~/systems/Core';
import type { Maybe } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

export enum AccountScreen {
  list = 'list',
  add = 'add',
}

type MachineContext = {
  accounts?: Account[];
  account?: Maybe<Account>;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Account[];
  };
  fetchAccount: {
    data: Account;
  };
  selectAccount: {
    data: Account;
  };
};

export type MachineEvents =
  | { type: 'UPDATE_ACCOUNT'; input?: null }
  | { type: 'UPDATE_ACCOUNTS'; input?: null }
  | {
      type: 'HIDE_ACCOUNT';
      input: AccountInputs['hideAccount'];
    }
  | { type: 'SELECT_ACCOUNT'; input: AccountInputs['selectAccount'] };

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
    initial: 'fetchingAccounts',
    states: {
      fetchingAccounts: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccounts',
          onDone: [
            {
              target: 'fetchingAccount',
              actions: ['assignAccounts', 'setIsLogged'],
              cond: 'hasAccounts',
            },
            {
              target: 'done',
              actions: ['assignAccounts', 'setIsUnlogged'],
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
      fetchingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccount',
          onDone: [
            {
              target: 'done',
              actions: ['assignAccount'],
              cond: 'hasAccount',
            },
            {
              target: 'done',
              actions: ['assignAccount'],
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
      selectingAccount: {
        invoke: {
          src: 'selectAccount',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingAccounts',
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
      done: {
        after: {
          TIMEOUT: 'fetchingAccounts', // retry
        },
      },
      failed: {
        after: {
          INTERVAL: 'fetchingAccounts', // retry
        },
      },
    },
    on: {
      UPDATE_ACCOUNTS: {
        target: 'fetchingAccounts',
      },
      UPDATE_ACCOUNT: {
        target: 'fetchingAccount',
      },
      HIDE_ACCOUNT: {
        actions: ['hideAccount'],
        target: 'done',
      },
      SELECT_ACCOUNT: {
        target: 'selectingAccount',
      },
    },
  },
  {
    delays: { INTERVAL: 2000, TIMEOUT: 15000 },
    actions: {
      assignAccounts: assign({
        accounts: (_, ev) => ev.data,
      }),
      assignAccount: assign({
        account: (ctx, ev) => ev.data,
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      setIsLogged: () => {
        localStorage.setItem(IS_LOGGED_KEY, 'true');
      },
      setIsUnlogged: () => {
        localStorage.removeItem(IS_LOGGED_KEY);
      },
      hideAccount: assign({
        account: (ctx, ev) => {
          const account = ctx.account;
          const { isHidden, address } = ev.input.data;
          if (account) {
            account.isHidden = isHidden;
            AccountService.hideAccount({
              data: { address, isHidden },
            });
          }
          return account;
        },
      }),
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    services: {
      fetchAccounts: FetchMachine.create<never, Account[]>({
        showError: true,
        async fetch() {
          return AccountService.getAccounts();
        },
      }),
      fetchAccount: FetchMachine.create<never, Account | undefined>({
        showError: true,
        async fetch() {
          const accountToFetch = await AccountService.getSelectedAccount();
          if (!accountToFetch) return undefined;
          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const providerUrl =
            selectedNetwork?.url || import.meta.env.VITE_FUEL_PROVIDER_URL;
          const accountWithBalance = await AccountService.fetchBalance({
            account: accountToFetch,
            providerUrl,
          });
          return accountWithBalance;
        },
      }),
      selectAccount: FetchMachine.create<
        AccountInputs['selectAccount'],
        Account
      >({
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid account address');
          }
          const account = await AccountService.selectAccount(input);
          if (!account) {
            throw new Error('Failed to select account');
          }
          return account;
        },
      }),
    },
    guards: {
      hasAccount: (ctx, ev) => {
        return Boolean(ctx?.account || ev?.data);
      },
      hasAccounts: (ctx, ev) => {
        return Boolean((ctx?.accounts || ev.data || []).length);
      },
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<AccountMachine>;
export type AccountMachineState = StateFrom<AccountMachine>;
