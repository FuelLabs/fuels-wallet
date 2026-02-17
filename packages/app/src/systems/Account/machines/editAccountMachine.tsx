import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { store } from '~/store';
import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

import { AccountService } from '../services/account';
import type { AccountInputs } from '../services/account';

type MachineContext = {
  account?: Maybe<Account>;
  /**
   * Used as data on account edit
   */
  address?: string;
};

type MachineServices = {
  fetchAccount: {
    data: Account;
  };
};

export type EditAccountMachineEvents =
  | {
      type: 'UPDATE_ACCOUNT';
      input: AccountInputs['updateAccount'];
    }
  | {
      type: 'ADD_READONLY_ACCOUNT';
      input: { address: string };
    };

export const editAccountMachine = createMachine(
  {
    tsTypes: {} as import('./editAccountMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as EditAccountMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetchingAccount',
    states: {
      idle: {
        on: {
          UPDATE_ACCOUNT: {
            target: 'updatingAccount',
          },
          ADD_READONLY_ACCOUNT: {
            target: 'addingReadOnlyAccount',
          },
        },
      },
      fetchingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext) => ({
              address: ctx.address,
            }),
          },
          onDone: {
            actions: ['assignAccount'],
            target: 'idle',
          },
          onError: {
            target: 'failed',
          },
        },
      },
      updatingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'updateAccount',
          data: {
            input: (_, ev: EditAccountMachineEvents) => ev.input,
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToList'],
              target: 'idle',
            },
          ],
        },
      },
      addingReadOnlyAccount: {
        tags: ['loading'],
        invoke: {
          src: 'addReadOnlyAccount',
          data: {
            input: (_, ev: EditAccountMachineEvents) => ev.input,
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToList'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
      notifyUpdateAccounts: () => {
        store.refreshAccounts({ skipLoading: true });
        store.refreshConsolidateCoins();
      },
      redirectToList() {
        store.openAccountList();
      },
    },
    services: {
      fetchAccount: FetchMachine.create({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }: { input: { address: string } }) {
          if (!input?.address) return undefined;
          return AccountService.fetchAccount(input);
        },
      }),
      updateAccount: FetchMachine.create({
        showError: true,
        maxAttempts: 1,
        async fetch({
          input,
        }: { input: { address: string; data: Partial<Account> } }) {
          if (!input?.data.name?.trim()) return undefined;
          return AccountService.updateAccount(input);
        },
      }),
      addReadOnlyAccount: FetchMachine.create({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          return AccountService.addAccount({
            data: {
              name: 'Read-Only Account',
              address: (input as { address: string }).address,
              publicKey: '',
              isHidden: false,
            },
          });
        },
      }),
    },
  }
);

export type EditAccountMachine = typeof editAccountMachine;
export type EditAccountMachineService = InterpreterFrom<EditAccountMachine>;
export type EditAccountMachineState = StateFrom<EditAccountMachine>;
