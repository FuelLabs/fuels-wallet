import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

import { AccountService } from '../services/account';
import type { AccountInputs } from '../services/account';

type MachineContext = {
  account?: Maybe<Account>;
  address?: string;
  exportedKey?: string;
  error?: string;
};

type MachineServices = {
  fetchAccount: {
    data: Account;
  };
  exportAccount: {
    data: string;
  };
};

export type ExportAccountMachineEvents = {
  type: 'EXPORT_ACCOUNT';
  input: Omit<VaultInputs['exportPrivateKey'], 'address'>;
};

export const exportAccountMachine = createMachine(
  {
    tsTypes: {} as import('./exportAccountMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as ExportAccountMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetchingAccount',
    states: {
      idle: {},
      fetchingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext, _: ExportAccountMachineEvents) => ({
              address: ctx.address,
            }),
          },
          onDone: {
            actions: ['assignAccount'],
            target: 'waitingPassword',
          },
          onError: [
            {
              target: 'failed',
            },
          ],
        },
      },
      waitingPassword: {
        tags: ['unlockOpened'],
        on: {
          EXPORT_ACCOUNT: {
            target: 'exportingAccount',
          },
        },
      },
      exportingAccount: {
        tags: ['loading', 'unlockOpened'],
        entry: ['clearError'],
        invoke: {
          src: 'exportAccount',
          data: {
            input: (
              ctx: MachineContext,
              ev: Extract<
                ExportAccountMachineEvents,
                { type: 'EXPORT_ACCOUNT' }
              >
            ) => ({
              address: ctx.address,
              password: ev.input.password,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: ['assignError'],
              target: 'waitingPassword',
            },
            {
              actions: ['assignExportedKey'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {},
    },
  },
  {
    actions: {
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
      assignExportedKey: assign({
        exportedKey: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: 'Invalid password',
      }),
      clearError: assign({
        error: undefined,
      }),
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
      exportAccount: FetchMachine.create<
        VaultInputs['exportPrivateKey'],
        MachineServices['exportAccount']['data']
      >({
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid account address');
          }

          const privateKey = await VaultService.exportPrivateKey(input);

          return privateKey;
        },
      }),
    },
  }
);

export type ExportAccountMachine = typeof exportAccountMachine;
export type ExportAccountMachineService = InterpreterFrom<ExportAccountMachine>;
export type ExportAccountMachineState = StateFrom<ExportAccountMachine>;
