/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { MNEMONIC_SIZE } from '~/config';
import type { Account } from '~/systems/Account';
import { AccountService, accountEvents } from '~/systems/Account';
import { getPhraseFromValue, getWordsFromValue } from '~/systems/Core';
import type { Maybe } from '~/systems/Core';

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

export enum SignUpType {
  create = 'CREATE',
  recover = 'RECOVER',
}

type FormValues = {
  mnemonic?: string[];
  password?: string;
};

type MachineContext = {
  type: SignUpType;
  attempts: number;
  isConfirmed?: boolean;
  error?: string;
  data?: Maybe<FormValues>;
  account?: Maybe<Account>;
};

type MachineServices = {
  createManager: {
    data: Maybe<Account>;
  };
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'CREATE_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } };

export const signUpMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./signUpMachine.typegen').Typegen0,
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'checking',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      checking: {
        always: [
          {
            target: 'idle',
            cond: 'isCreatingWallet',
          },
          {
            target: 'waitingMnemonic',
          },
        ],
      },
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
          CONFIRM_MNEMONIC: [
            {
              actions: ['confirmMnemonic', 'assignMnemonicWhenRecovering'],
              cond: 'hasEnoughAttempts',
            },
            {
              target: 'failed',
            },
          ],
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
          src: 'createManager',
          onDone: {
            actions: ['assignAccount', 'deleteData', 'sendAccountCreated'],
            target: 'done',
          },
          onError: {
            actions: 'assignError',
            target: 'failed',
          },
        },
      },
      failed: {
        entry: 'assignError',
      },
      done: {},
    },
  },
  {
    actions: {
      createMnemonic: assign({
        data: (_) => ({
          mnemonic: getWordsFromValue(Mnemonic.generate(MNEMONIC_SIZE)),
        }),
      }),
      confirmMnemonic: assign({
        attempts: (ctx) => {
          return ctx.attempts + 1;
        },
        isConfirmed: (ctx, ev) => {
          if (ctx.type === SignUpType.recover) return true;
          return getPhraseFromValue(ev.data.words) === getPhraseFromValue(ctx.data?.mnemonic);
        },
      }),
      assignMnemonicWhenRecovering: assign({
        data: (ctx, ev) => {
          return ctx.type === SignUpType.recover ? { mnemonic: ev.data.words } : ctx.data;
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
      sendAccountCreated: (ctx) => {
        if (ctx.account) {
          accountEvents.accountCreated(ctx.account);
        }
      },
    },
    guards: {
      isCreatingWallet: (ctx) => {
        return ctx.type === SignUpType.create;
      },
      isMnemonicConfirmed: (ctx) => {
        return Boolean(ctx.isConfirmed);
      },
      hasEnoughAttempts: (ctx) => {
        return Boolean(ctx.attempts < 5);
      },
    },
    services: {
      async createManager({ data }) {
        if (!data?.password) {
          throw new Error('Invalid password');
        }
        if (!data.mnemonic) {
          throw new Error('Invalid mnemonic');
        }

        const manager = await AccountService.createManager({ data });
        const account = manager.getAccounts()[0];
        return AccountService.addAccount({
          data: {
            name: 'Account 1',
            address: account.address.toAddress(),
            publicKey: account.publicKey,
          },
        });
      },
    },
  }
);

export type SignUpMachine = typeof signUpMachine;
export type SignUpMachineService = InterpreterFrom<SignUpMachine>;
export type SignUpMachineState = StateFrom<SignUpMachine>;
