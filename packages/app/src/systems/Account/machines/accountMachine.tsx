import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import { FetchMachine } from '~/systems/Core';
import type { Maybe } from '~/systems/Core';

export enum AccountScreen {
  list = 'list',
  add = 'add',
}

export type AccountInitialInput = {
  type: AccountScreen;
  accountAddress?: string;
};

type MachineContext = {
  accounts?: Account[];
  account?: Maybe<Account>;
  accountAddress?: string;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Account[];
  };
  selectAccount: {
    data: Account;
  };
};

// edit service to machine and do state stuff for selected account and add to state then add get that info in new useAccounts hook then add test

type MachineEvents =
  | { type: 'SET_INITIAL_DATA'; input: AccountInitialInput }
  | { type: 'UPDATE_ACCOUNT'; input?: null }
  | {
      type: 'SET_BALANCE_VISIBILITY';
      input: AccountInputs['setBalanceVisibility'];
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
              target: 'done',
              actions: ['assignAccounts', 'assignAccount', 'setLocalStorage'],
              cond: 'hasAccount',
            },
            {
              target: 'done',
              actions: ['removeLocalStorage'],
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
      SET_INITIAL_DATA: [
        {
          actions: ['assignAccountAddress'],
          target: 'fetchingAccounts',
        },
      ],
      UPDATE_ACCOUNT: {
        target: 'fetchingAccounts',
      },
      SET_BALANCE_VISIBILITY: {
        actions: ['setBalanceVisibility'],
        target: 'done',
      },
    },
  },
  {
    delays: { INTERVAL: 2000, TIMEOUT: 15000 },
    actions: {
      assignAccountAddress: assign({
        accountAddress: (_, ev) => {
          console.log('here again', ev.input);
          return ev.input.accountAddress;
        },
      }),
      assignAccounts: assign({
        accounts: (_, ev) => ev.data,
      }),
      assignAccount: assign({
        account: (ctx, ev) => {
          console.log('ctx', ctx);
          console.log('data', ev.data);
          return ctx.accountAddress
            ? ev.data.find((account) => account.address === ctx.accountAddress)
            : null;
        },
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
      setBalanceVisibility: assign({
        account: (ctx, ev) => {
          const account = ctx.account;
          const { isHidden, address } = ev.input.data;
          if (account) {
            account.isHidden = isHidden;
            AccountService.setBalanceVisbility({
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
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<AccountMachine>;
export type AccountMachineState = StateFrom<AccountMachine>;
