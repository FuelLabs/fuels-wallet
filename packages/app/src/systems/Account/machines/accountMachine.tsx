import { toast } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';
import { UnlockService } from '../services/unlock';

import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import type { Maybe } from '~/systems/Core';
import { FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

export enum AccountScreen {
  list = 'list',
  add = 'add',
}

type MachineContext = {
  accounts?: Account[];
  accountName?: string;
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
  addAccount: {
    data: Account;
  };
};

export type MachineEvents =
  | { type: 'UPDATE_ACCOUNT'; input?: null }
  | { type: 'UPDATE_ACCOUNTS'; input?: null }
  | { type: 'HIDE_ACCOUNT'; input: AccountInputs['hideAccount'] }
  | { type: 'SELECT_ACCOUNT'; input: AccountInputs['selectAccount'] }
  | { type: 'ADD_ACCOUNT'; input: string };

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
      idle: {
        on: {
          UPDATE_ACCOUNTS: {
            target: 'fetchingAccounts',
          },
          UPDATE_ACCOUNT: {
            target: 'fetchingAccount',
          },
          HIDE_ACCOUNT: {
            actions: ['hideAccount'],
            target: 'idle',
          },
          SELECT_ACCOUNT: {
            target: 'selectingAccount',
          },
          ADD_ACCOUNT: {
            actions: ['assignAccountName'],
            target: 'addingAccount',
          },
        },
        after: {
          TIMEOUT: 'fetchingAccounts', // retry
        },
      },
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
              target: 'idle',
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
              target: 'idle',
              actions: ['assignAccount'],
              cond: 'hasAccount',
            },
            {
              target: 'idle',
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
              actions: 'assignError',
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingAccounts',
            },
          ],
        },
      },
      addingAccount: {
        tags: ['loading'],
        exit: ['clearAccountName'],
        invoke: {
          src: 'addAccount',
          data: {
            input: (ctx: MachineContext) => ({
              data: {
                name: ctx.accountName,
              },
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: 'assignError',
              target: 'failed',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingAccounts',
            },
          ],
        },
      },
      failed: {
        on: {
          ADD_ACCOUNT: {
            actions: ['assignAccountName'],
            target: 'addingAccount',
          },
        },
        after: {
          INTERVAL: 'fetchingAccounts', // retry
        },
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
        account: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      setIsLogged: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
      },
      setIsUnlogged: () => {
        Storage.removeItem(IS_LOGGED_KEY);
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
      assignAccountName: assign({
        accountName: (_, ev) => ev.input,
      }),
      clearAccountName: assign({
        accountName: (_) => undefined,
      }),
      notifyUpdateAccounts() {
        store.updateAccounts();
        toast.success('Account added successfully');
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
        maxAttempts: 1,
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
        maxAttempts: 1,
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
      addAccount: FetchMachine.create<AccountInputs['addNewAccount'], Account>({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          const manager = await UnlockService.getManagerUnlocked();
          if (!manager) {
            throw new Error('Manager is not unlocked');
          }
          if (!input?.data.name.trim()) {
            throw new Error('Name cannot be empty');
          }
          let account = await AccountService.addNewAccount({
            data: {
              manager,
              name: input.data.name,
            },
          });
          if (!account) {
            throw new Error('Failed to add account');
          }
          account = await AccountService.selectAccount({
            address: account.address.toString(),
          });
          return account as Account;
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
