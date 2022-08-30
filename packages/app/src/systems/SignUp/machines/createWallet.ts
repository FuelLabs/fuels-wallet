/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Mnemonic } from '@fuel-ts/mnemonic';
import { WalletManager } from '@fuel-ts/wallet-manager';
import { Buffer as BufferPolyfill } from 'buffer';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

import { MNEMONIC_ENTROPY } from '~/config';
import { Maybe } from '~/types';

/**
 * TODO: this is here because @fuel-ts/wallet-manager is getting an error
 * related to Buffer when trying to use manager.addVault()
 */
globalThis.Buffer = BufferPolyfill;

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

type FormValues = {
  mnemonic?: string[];
  password?: string;
};

type MachineContext = {
  attempts: number;
  mnemonic?: string[];
  isConfirmed?: boolean;
  walletManager?: WalletManager;
  error?: string;
  data?: Maybe<FormValues>;
};

type MachineServices = {
  createWalletManager: {
    data: WalletManager;
  };
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'CREATE_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } };

export const createWalletMachine = createMachine(
  {
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
            target: 'confirmingMnemonic',
          },
        },
      },
      confirmingMnemonic: {
        on: {
          CONFIRM_MNEMONIC: {
            actions: ['confirmMnemonic', 'assignMnemonic'],
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
            actions: ['assignManager', 'deleteData'],
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
        mnemonic: (_ctx) => Mnemonic.generate(MNEMONIC_ENTROPY).split(' '),
      }),
      confirmMnemonic: assign({
        attempts: (ctx) => ctx.attempts + 1,
        isConfirmed: (ctx, ev) => {
          return ev.data.words.join('') === ctx.mnemonic?.join('');
        },
      }),
      assignMnemonic: assign({
        data: (ctx, ev) => (ctx.isConfirmed ? { mnemonic: ev.data.words } : null),
      }),
      assignManager: assign({
        walletManager: (_, ev) => ev.data,
      }),
      assignPassword: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          password: ev.data.password,
        }),
      }),
      assignError: assign({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (_, ev) => ev.data as any,
      }),
      deleteData: assign({
        data: (_) => null,
      }),
    },
    guards: {
      isMnemonicConfirmed: (ctx) => Boolean(ctx.isConfirmed),
    },
    services: {
      async createWalletManager({ data }) {
        if (!data?.password || !data?.mnemonic) {
          throw new Error('Invalid data');
        }

        const manager = new WalletManager();
        await manager.unlock(data.password);
        await manager.addVault({
          type: 'mnemonic',
          secret: data.mnemonic.join(' '),
        });

        return manager;
      },
    },
  }
);

export type CreateWalletMachine = typeof createWalletMachine;
export type CreateWalletMachineService = InterpreterFrom<CreateWalletMachine>;
export type CreateWalletMachineState = StateFrom<CreateWalletMachine>;
