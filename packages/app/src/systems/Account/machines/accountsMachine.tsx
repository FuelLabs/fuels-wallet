import type { Account, AccountWithBalance } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import { CoreService, FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { AccountService } from '../services/account';
import type { AccountInputs } from '../services/account';

type MachineContext = {
  accounts?: Account[];
  account?: AccountWithBalance;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Account[];
  };
  fetchAccount: {
    data: AccountWithBalance;
  };
  setCurrentAccount: {
    data: Account;
  };
};

export type AccountsMachineEvents =
  | { type: 'REFRESH_ACCOUNT'; input?: null }
  | { type: 'REFRESH_ACCOUNTS'; input?: null }
  | { type: 'RELOAD_BALANCE'; input?: null }
  | { type: 'SET_CURRENT_ACCOUNT'; input: AccountInputs['setCurrentAccount'] }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'LOGOUT'; input?: void }
  | {
      type: 'TOGGLE_HIDE_ACCOUNT';
      input: AccountInputs['updateAccount'];
    };

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
};

export const accountsMachine = createMachine(
  {
    tsTypes: {} as import('./accountsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as AccountsMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetchingAccounts',
    states: {
      idle: {
        on: {
          SET_CURRENT_ACCOUNT: {
            target: 'settingCurrentAccount',
          },
          TOGGLE_HIDE_ACCOUNT: {
            actions: ['toggleHideAccount', 'notifyUpdateAccounts'],
            target: 'idle',
          },
        },
        after: {
          /**
           * Update accounts every 5 seconds
           */
          TIMEOUT: {
            target: 'refreshAccount',
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
              actions: ['assignAccounts'],
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
      refreshAccount: {
        ...fetchAccount,
      },
      reloadingBalance: {
        tags: ['loading'],
        ...fetchAccount,
      },
      settingCurrentAccount: {
        invoke: {
          src: 'setCurrentAccount',
          data: {
            input: (_: MachineContext, ev: AccountsMachineEvents) => ev.input,
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
      REFRESH_ACCOUNTS: {
        target: 'fetchingAccounts',
      },
      REFRESH_ACCOUNT: {
        target: 'refreshAccount',
      },
      RELOAD_BALANCE: {
        target: 'reloadingBalance',
        actions: ['notifyUpdateAccounts'],
      },
    },
  },
  {
    delays: {
      INTERVAL: 2000,
      TIMEOUT: 5000,
    },
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
      clearContext: assign(() => ({})),
      toggleHideAccount: (_, ev) => {
        AccountService.updateAccount(ev.input);
      },
      setIsLogged: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
      },
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome: () => {
        store.closeOverlay();
      },
    },
    services: {
      fetchAccounts: FetchMachine.create<never, Account[]>({
        showError: true,
        async fetch() {
          return AccountService.getAccounts();
        },
      }),
      fetchAccount: FetchMachine.create<never, AccountWithBalance | undefined>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          let accountToFetch = await AccountService.getCurrentAccount();
          if (!accountToFetch) {
            await AccountService.setCurrentAccountToDefault();
            accountToFetch = await AccountService.getCurrentAccount();
          }
          if (!accountToFetch) return undefined;
          const selectedNetwork = await NetworkService.getSelectedNetwork();
          if (!selectedNetwork) {
            throw new Error('No selected network');
          }

          const providerUrl = selectedNetwork.url;
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
      logout: FetchMachine.create<never, void>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          await CoreService.clear();
        },
      }),
    },
    guards: {
      isLoggedIn: () => {
        return !!Storage.getItem(IS_LOGGED_KEY);
      },
      hasAccount: (ctx, ev) => {
        return Boolean(ev?.data || ctx?.account);
      },
      hasAccounts: (ctx, ev) => {
        return Boolean((ev.data || ctx?.accounts || []).length);
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineService = InterpreterFrom<AccountsMachine>;
export type AccountsMachineState = StateFrom<AccountsMachine>;
