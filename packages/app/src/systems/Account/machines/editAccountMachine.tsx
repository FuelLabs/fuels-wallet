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

export type EditAccountMachineEvents = {
  type: 'UPDATE_ACCOUNT';
  input: AccountInputs['updateAccount'];
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
        },
      },
      fetchingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext, _: EditAccountMachineEvents) => ({
              address: ctx.address,
            }),
          },
          onDone: {
            actions: ['assignAccount'],
            target: 'idle',
          },
          onError: [
            {
              target: 'failed',
            },
          ],
        },
      },
      updatingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'updateAccount',
          data: {
            input: (_: MachineContext, ev: EditAccountMachineEvents) =>
              ev.input,
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
      },
      redirectToList() {
        store.openAccountList();
      },
    },
    services: {
      fetchAccount: FetchMachine.create<
        AccountInputs['fetchAccount'],
        Account | undefined
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.address) return undefined;
          return AccountService.fetchAccount(input);
        },
      }),
      updateAccount: FetchMachine.create<
        AccountInputs['updateAccount'],
        Account | undefined
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.data.name?.trim()) {
            throw new Error('Name cannot be empty');
          }
          const { name } = input.data;

          if (await AccountService.checkAccountNameExists(name)) {
            throw new Error('Account name already exists');
          }

          return AccountService.updateAccount({
            ...input,
          });
        },
      }),
    },
  }
);

export type EditAccountMachine = typeof editAccountMachine;
export type EditAccountMachineService = InterpreterFrom<EditAccountMachine>;
export type EditAccountMachineState = StateFrom<EditAccountMachine>;
