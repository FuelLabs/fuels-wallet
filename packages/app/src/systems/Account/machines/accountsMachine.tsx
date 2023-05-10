import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import type { Maybe } from '~/systems/Core';
import { CoreService, FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { VaultService } from '~/systems/Vault';

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
  setCurrentAccount: {
    data: Account;
  };
};

export type AccountsMachineEvents =
  | { type: 'REFRESH_ACCOUNT'; input?: null }
  | { type: 'REFRESH_ACCOUNTS'; input?: null }
  | { type: 'SET_CURRENT_ACCOUNT'; input: AccountInputs['setCurrentAccount'] }
  | { type: 'LOGOUT'; input?: void }
  | {
      type: 'TOGGLE_HIDE_ACCOUNT';
      input: AccountInputs['updateAccount'];
    }
  | { type: 'ADD_ACCOUNT'; input?: null };

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
          REFRESH_ACCOUNTS: {
            target: 'fetchingAccounts',
          },
          REFRESH_ACCOUNT: {
            target: 'refreshAccount',
          },
          TOGGLE_HIDE_ACCOUNT: {
            actions: ['toggleHideAccount', 'notifyUpdateAccounts'],
            target: 'idle',
          },
          ADD_ACCOUNT: {
            target: 'addingAccount',
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
      addingAccount: {
        tags: ['addingAccount'],
        invoke: {
          src: 'addAccount',
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'idle',
            },
          ],
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
      refreshAccount: {
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
      setIsUnlogged: () => {
        Storage.removeItem(IS_LOGGED_KEY);
      },
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome() {
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
      logout: FetchMachine.create<never, void>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          await CoreService.clear();
        },
      }),
      addAccount: FetchMachine.create<never, Account>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          const name = await AccountService.generateAccountName();

          if (await AccountService.checkAccountNameExists(name)) {
            throw new Error('Account name already exists');
          }

          // Add account to vault
          const accountVault = await VaultService.addAccount({
            // TODO: remove this when we have multiple vaults
            // https://github.com/FuelLabs/fuels-wallet/issues/562
            vaultId: 0,
          });

          // Add account to the database
          let account = await AccountService.addAccount({
            data: {
              name,
              ...accountVault,
            },
          });

          // set as active account
          account = await AccountService.setCurrentAccount({
            address: account.address.toString(),
          });

          return account;
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
