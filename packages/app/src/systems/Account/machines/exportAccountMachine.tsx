import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineContext = {
  account?: Maybe<Account>;
  address?: string;
  exportedKey?: string;
};

type MachineServices = {
  fetchAccount: {
    data: Account;
  };
  exportAccount: {
    data: string;
  };
};

export type ExportAccountMachineEvents =
  | {
      type: 'EXPORT_ACCOUNT';
      input: Omit<VaultInputs['exportPrivateKey'], 'address'>;
    }
  | {
      type: 'RETRY';
    };

export const exportAccountMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
        on: {
          EXPORT_ACCOUNT: {
            target: 'exportingAccount',
          },
        },
      },
      exportingAccount: {
        tags: ['loading'],
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
              target: 'failed',
            },
            {
              actions: ['assignExportedKey'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {
        on: {
          RETRY: {
            target: 'waitingPassword',
          },
        },
      },
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
        showError: true,
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
