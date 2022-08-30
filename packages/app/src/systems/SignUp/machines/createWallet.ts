/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { MNEMONIC_ENTROPY } from '~/config';
import type { Account } from '~/systems/Account';
import { createManager } from '~/systems/Account';
import { db } from '~/systems/Core';
import type { Maybe } from '~/types';

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

type FormValues = {
  mnemonic?: string[];
  password?: string;
};

type MachineContext = {
  attempts: number;
  isConfirmed?: boolean;
  error?: string;
  data?: Maybe<FormValues>;
  account?: Maybe<Account>;
};

type MachineServices = {
  createWalletManager: {
    data: Maybe<Account>;
  };
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'CREATE_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } };

export const createWalletMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./createWallet.typegen').Typegen0,
    id: '(machine)',
    initial: 'idle',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    context: {
      attempts: 0,
    },
    states: {
      idle: {
        on: {
          CREATE_MNEMONIC: {
            target: 'showingMnemonic',
            actions: 'createMnemonic',
          },
        },
      },
      showingMnemonic: {
        on: {
          NEXT: {
            target: 'waitingMnemonic',
          },
        },
      },
      waitingMnemonic: {
        on: {
          CONFIRM_MNEMONIC: {
            actions: 'confirmMnemonic',
          },
          NEXT: {
            target: 'addingPassword',
            cond: 'isMnemonicConfirmed',
          },
        },
      },
      addingPassword: {
        on: {
          CREATE_MANAGER: {
            target: 'creatingWallet',
            actions: 'assignPassword',
          },
        },
      },
      creatingWallet: {
        tags: ['loading'],
        invoke: {
          src: 'createWalletManager',
          onDone: {
            actions: ['assignAccount', 'deleteData'],
            target: 'done',
          },
          onError: {
            actions: 'assignError',
            target: 'failed',
          },
        },
      },
      failed: {},
      done: {},
    },
  },
  {
    actions: {
      createMnemonic: assign({
        data: (_) => ({
          mnemonic: Mnemonic.generate(MNEMONIC_ENTROPY).split(' '),
        }),
      }),
      confirmMnemonic: assign({
        attempts: (ctx) => {
          return ctx.attempts + 1;
        },
        isConfirmed: (ctx, ev) => {
          return ev.data.words.join('') === ctx.data?.mnemonic?.join('');
        },
      }),
      assignPassword: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          password: ev.data.password,
        }),
      }),
      assignError: assign({
        error: (_, ev) => ev.data as any,
      }),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
      deleteData: assign({
        data: (_) => null,
      }),
    },
    guards: {
      isMnemonicConfirmed: (ctx) => {
        return Boolean(ctx.isConfirmed);
      },
    },
    services: {
      async createWalletManager({ data }) {
        if (!data?.password || !data?.mnemonic) {
          throw new Error('Invalid data');
        }

        const manager = await createManager(data);
        const account = manager.getAccounts()[0];
        return db.addAccount({
          vaultKey: manager.STORAGE_KEY,
          name: 'Account 1',
          address: account.address.toAddress(),
        });
      },
    },
  }
);

export type CreateWalletMachine = typeof createWalletMachine;
export type CreateWalletMachineService = InterpreterFrom<CreateWalletMachine>;
export type CreateWalletMachineState = StateFrom<CreateWalletMachine>;
