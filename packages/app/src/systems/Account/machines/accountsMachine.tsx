import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import { unlockMachine, unlockMachineErrorAction } from './unlockMachine';
import type {
  UnlockMachine,
  UnlockVaultReturn,
  UnlockVaultEvent,
} from './unlockMachine';

import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import type { ChildrenMachine, Maybe } from '~/systems/Core';
import { FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

type MachineContext = {
  accounts?: Account[];
  accountName?: string;
  account?: Maybe<Account>;
  unlockError?: string;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Account[];
  };
  fetchAccount: {
    data: Account;
  };
  setCurrentAccount: {
    data: Account;
  };
  addAccount: {
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
  | { type: 'SET_CURRENT_ACCOUNT'; input: AccountInputs['setCurrentAccount'] }
  | {
      type: 'ADD_ACCOUNT';
      input: string;
    }
  | { type: 'UNLOCK_VAULT'; input: AccountInputs['unlockVault'] }
  | { type: 'CLOSE_UNLOCK'; input?: void }
  | { type: 'LOGOUT'; input?: void };

const fetchAccount = {
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
        actions: ['assignAccount', 'setIsUnlogged'],
      },
    ],
    onError: [
      {
        actions: 'assignError',
        target: 'failed',
      },
    ],
  },
};

export const accountsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./accountsMachine.typegen').Typegen0,
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
          HIDE_ACCOUNT: {
            actions: ['hideAccount'],
            target: 'idle',
          },
          SET_CURRENT_ACCOUNT: {
            target: 'settingCurrentAccount',
          },
          ADD_ACCOUNT: {
            actions: ['assignAccountName'],
            target: 'unlocking',
          },
        },
        after: {
          /**
           * Update accounts every 5 minutes
           */
          TIMEOUT: {
            target: 'updateAccount',
            cond: 'isLoggedIn',
          },
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
        ...fetchAccount,
      },
      updateAccount: {
        ...fetchAccount,
      },
      settingCurrentAccount: {
        invoke: {
          src: 'setCurrentAccount',
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
            input: (ctx: MachineContext, ev: UnlockVaultReturn) => {
              return {
                data: {
                  manager: ev.data,
                  name: ctx.accountName,
                },
              };
            },
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
      unlocking: {
        invoke: {
          id: 'unlock',
          src: 'unlock',
          onDone: [
            unlockMachineErrorAction('unlocking', 'unlockError'),
            {
              actions: ['clearUnlockError'],
              target: 'addingAccount',
            },
          ],
        },
        on: {
          UNLOCK_VAULT: {
            // send to the child machine
            actions: [
              send<MachineContext, UnlockVaultEvent>(
                (_, ev) => ({
                  type: 'UNLOCK_VAULT',
                  input: ev.input,
                }),
                { to: 'unlock' }
              ),
            ],
          },
          CLOSE_UNLOCK: {
            target: 'fetchingAccount',
          },
        },
      },
      loggingout: {
        tags: ['loading'],
        invoke: {
          src: 'logout',
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: 'assignError',
              target: 'failed',
            },
            {
              actions: ['clearContext', 'refreshApplication'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {
        on: {
          ADD_ACCOUNT: {
            actions: ['assignAccountName'],
            target: 'unlocking',
          },
        },
        after: {
          INTERVAL: {
            target: 'fetchingAccounts', // retry
            cond: 'isLoggedIn',
          },
        },
      },
    },
    on: {
      LOGOUT: {
        target: 'loggingout',
      },
      UPDATE_ACCOUNTS: {
        target: 'fetchingAccounts',
      },
      UPDATE_ACCOUNT: {
        target: 'updateAccount',
      },
    },
  },
  {
    delays: {
      INTERVAL: 2000,
      TIMEOUT: 5000,
    },
    actions: {
      clearUnlockError: assign({
        unlockError: (_) => undefined,
      }),
      assignAccounts: assign({
        accounts: (_, ev) => ev.data,
      }),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      clearContext: assign(() => ({})),
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
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome() {
        store.closeOverlay();
      },
    },
    services: {
      unlock: unlockMachine,
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
          const accountToFetch = await AccountService.getCurrentAccount();
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
      setCurrentAccount: FetchMachine.create<
        AccountInputs['setCurrentAccount'],
        Account
      >({
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid account address');
          }
          const account = await AccountService.setCurrentAccount(input);
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
          if (!input?.data.name.trim()) {
            throw new Error('Name cannot be empty');
          }
          if (!input?.data.manager) {
            throw new Error('Manager is not unlocked');
          }
          let account = await AccountService.addNewAccount(input);
          if (!account) {
            throw new Error('Failed to add account');
          }
          account = await AccountService.setCurrentAccount({
            address: account.address.toString(),
          });
          return account as Account;
        },
      }),
      logout: FetchMachine.create<never, void>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          await AccountService.logout();
        },
      }),
    },
    guards: {
      isLoggedIn: () => {
        return !!Storage.getItem(IS_LOGGED_KEY);
      },
      hasAccount: (ctx, ev) => {
        return Boolean(ctx?.account || ev?.data);
      },
      hasAccounts: (ctx, ev) => {
        return Boolean((ctx?.accounts || ev.data || []).length);
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineService = InterpreterFrom<AccountsMachine>;
export type AccountsMachineState = StateFrom<AccountsMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
