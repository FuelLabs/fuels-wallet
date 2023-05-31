/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { STORAGE_KEY } from '../components/SignUpProvider';
import { SignUpService } from '../services';

import { IS_LOGGED_KEY, MNEMONIC_SIZE } from '~/config';
import { store } from '~/store';
import {
  assignErrorMessage,
  getPhraseFromValue,
  getWordsFromValue,
  Storage,
} from '~/systems/Core';
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
  isFilled?: boolean;
  error?: string;
  data?: Maybe<FormValues>;
  account?: Maybe<Account>;
};

type MachineServices = {
  setupVault: {
    data: Maybe<Account>;
  };
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'RESET' }
  | { type: 'CREATE_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } };

export const signUpMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./signUpMachine.typegen').Typegen0,
    id: '(machine)',
    initial: 'checking',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      atWelcome: {
        on: {
          NEXT: 'checking',
        },
      },
      checking: {
        always: [
          {
            target: 'idle',
            cond: 'isCreatingWallet',
          },
          {
            target: 'atWelcome',
            actions: 'redirectToWelcome',
            cond: 'isTypeNull',
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
        initial: 'invalidMnemonic',
        states: {
          invalidMnemonic: {
            entry: [
              assignErrorMessage(
                'The Seed Phrase is not valid. Check the words for typos or missing words'
              ),
            ],
          },
          mnemonicNotMatch: {
            entry: [
              assignErrorMessage(
                "The Seed Phrase doesn't match. Check the phrase for typos or missing words"
              ),
            ],
          },
          validMnemonic: {
            entry: ['cleanError'],
            on: {
              NEXT: {
                target: '#(machine).addingPassword',
              },
            },
          },
        },
        on: {
          CONFIRM_MNEMONIC: [
            {
              actions: ['assignIsFilled', 'assignMnemonicWhenRecovering'],
              target: '.validMnemonic',
              cond: 'isValidAndConfirmed',
            },
            {
              actions: ['assignIsFilled'],
              target: '.mnemonicNotMatch',
              cond: 'isValidMnemonic',
            },
            {
              actions: ['assignIsFilled'],
              target: '.invalidMnemonic',
            },
          ],
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
          src: 'setupVault',
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
      done: {
        entry: 'redirectToWalletCreated',
      },
    },
    on: {
      RESET: {
        target: 'atWelcome',
        actions: ['deleteData', 'redirectToWelcome'],
      },
    },
  },
  {
    actions: {
      assignIsFilled: assign({
        isFilled: (_, ev) => {
          const filledWords = ev.data.words.filter((word) => !!word);
          return ev.data.words.length === filledWords.length;
        },
      }),
      cleanError: assign({
        error: (_) => undefined,
      }),
      createMnemonic: assign({
        data: (_) => ({
          mnemonic: getWordsFromValue(Mnemonic.generate(MNEMONIC_SIZE)),
        }),
      }),
      assignMnemonicWhenRecovering: assign({
        data: (ctx, ev) => {
          const type = Storage.getItem(STORAGE_KEY);
          return type === SignUpType.recover
            ? { mnemonic: ev.data.words }
            : ctx.data;
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
      sendAccountCreated: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
        Storage.removeItem(STORAGE_KEY);
        store.updateAccounts();
      },
      redirectToWalletCreated() {},
    },
    guards: {
      isTypeNull: () => {
        const type = Storage.getItem(STORAGE_KEY);
        return !type;
      },
      isCreatingWallet: (_) => {
        const type = Storage.getItem(STORAGE_KEY);
        return type === SignUpType.create;
      },
      isValidMnemonic: (_, ev) => {
        return Mnemonic.isMnemonicValid(
          getPhraseFromValue(ev.data.words) || ''
        );
      },
      isValidAndConfirmed: (ctx, ev) => {
        const isValid = Mnemonic.isMnemonicValid(
          getPhraseFromValue(ev.data.words) || ''
        );
        const type = Storage.getItem(STORAGE_KEY);
        if (type === SignUpType.recover) return isValid;
        return (
          getPhraseFromValue(ev.data.words) ===
            getPhraseFromValue(ctx.data?.mnemonic) && isValid
        );
      },
    },
    services: {
      async setupVault({ data }) {
        if (!data?.password) {
          throw new Error('Invalid password');
        }
        if (!data.mnemonic) {
          throw new Error('Invalid mnemonic');
        }
        const account = await SignUpService.create({ data });
        return account;
      },
    },
  }
);

export type SignUpMachine = typeof signUpMachine;
export type SignUpMachineService = InterpreterFrom<SignUpMachine>;
export type SignUpMachineState = StateFrom<SignUpMachine>;
