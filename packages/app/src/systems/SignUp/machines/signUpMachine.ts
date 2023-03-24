/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { SignUpService } from '../services';

import { IS_LOGGED_KEY, MNEMONIC_SIZE } from '~/config';
import { store } from '~/store';
import {
  assignErrorMessage,
  FetchMachine,
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
  wordsForConfirmation?: string[];
  confirmationWords?: string[];
  positionsForConfirmation?: number[];
};

type MachineContext = {
  type: SignUpType;
  isFilled?: boolean;
  error?: string;
  data?: Maybe<FormValues>;
  account?: Maybe<Account>;
  isConfirmed?: boolean;
};

type MachineServices = {
  setupVault: {
    data: Maybe<Account>;
  };
  saveSignUp: {
    data: Maybe<FormValues>;
  };
  getSavedSignUp: {
    data: {
      mnemonic?: string[];
      account?: Account;
    };
  };
  getConfirmationWords: {
    data: {
      words?: string[];
      positions?: number[];
    };
  };
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'CREATE_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } }
  | { type: 'CREATE_PASSWORD'; data: { password: string } }
  | { type: 'SAVE_SIGNUP' };

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
      checking: {
        always: [
          {
            target: 'fetchingSavedData',
            cond: 'hasSavedMnemonic',
          },
          {
            target: 'idle',
            cond: 'isCreatingWallet',
          },
          {
            target: 'fetchingConfirmationWords',
          },
        ],
      },
      idle: {
        on: {
          NEXT: {
            target: 'addingPassword',
          },
        },
      },
      fetchingSavedData: {
        invoke: {
          src: 'getSavedSignUp',
          onDone: {
            actions: ['assignSavedData'],
            target: 'fetchingConfirmationWords',
          },
          onError: {
            actions: ['assignError'],
          },
        },
      },
      showingMnemonic: {
        on: {
          NEXT: {
            target: 'fetchingConfirmationWords',
          },
        },
      },
      fetchingConfirmationWords: {
        invoke: {
          src: 'getConfirmationWords',
          onDone: {
            actions: ['assignConfirmWalletData'],
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
                'The seed phrase is not valid check the words for typos or missing words'
              ),
            ],
          },
          mnemonicNotMatch: {
            entry: [
              assignErrorMessage(
                "The seed phrase doesn't match. Check the phrase for typos or missing words"
              ),
            ],
          },
          validMnemonic: {
            entry: ['cleanError'],
            on: {
              CREATE_MANAGER: {
                target: '#(machine).creatingWallet',
              },
            },
          },
        },
        on: {
          CONFIRM_MNEMONIC: [
            {
              actions: [
                'assignIsFilled',
                'assignMnemonicWhenRecovering',
                'assignConfirmationWords',
              ],
              target: 'confirmingMnemonic',
            },
          ],
        },
      },
      confirmingMnemonic: {
        invoke: {
          src: 'confirmMnemonic',
          onDone: {
            target: 'waitingMnemonic.validMnemonic',
          },
        },
      },
      addingPassword: {
        on: {
          CREATE_PASSWORD: {
            target: '#(machine).savingPassword',
            actions: ['assignPassword', 'createMnemonic'],
          },
        },
      },
      savingPassword: {
        tags: ['savingPassword'],
        invoke: {
          src: 'saveSignUp',
          onDone: {
            target: 'showingMnemonic',
          },
          onError: {
            actions: 'assignError',
            target: 'failed',
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
        data: (ctx) => {
          return {
            ...ctx.data,
            mnemonic: getWordsFromValue(Mnemonic.generate(MNEMONIC_SIZE)),
          };
        },
      }),
      assignMnemonicWhenRecovering: assign({
        data: (ctx, ev) => {
          return ctx.type === SignUpType.recover
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
      assignSavedData: assign({
        data: (_, ev) => ({
          mnemonic: ev.data.mnemonic,
        }),
        account: (_, ev) => ev.data.account,
      }),
      assignConfirmWalletData: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          wordsForConfirmation: ev.data.words,
          positionsForConfirmation: ev.data.positions,
        }),
      }),
      assignConfirmationWords: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          confirmationWords: ev.data.words,
        }),
      }),
      deleteData: assign({
        data: (_) => null,
      }),
      sendAccountCreated: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
        store.updateAccounts();
      },
      redirectToWalletCreated: () => {},
    },
    guards: {
      isCreatingWallet: (ctx) => {
        return ctx.type === SignUpType.create;
      },
      hasSavedMnemonic: () => {
        return SignUpService.hasSaved();
      },
    },
    services: {
      async setupVault({ data, account }) {
        if (!data?.mnemonic) {
          throw new Error('Invalid mnemonic');
        }
        if (account) {
          const walletAccount = await SignUpService.complete({ data, account });
          return walletAccount;
        }

        if (!data?.password) {
          throw new Error('Invalid password');
        }

        const walletAccount = await SignUpService.create({ data });
        return walletAccount;
      },
      async saveSignUp({ data }) {
        if (!data?.password) {
          throw new Error('Invalid password');
        }
        if (!data.mnemonic) {
          throw new Error('Invalid mnemonic');
        }

        await SignUpService.save({ data });
        return data;
      },
      getSavedSignUp: FetchMachine.create<
        null,
        MachineServices['getSavedSignUp']['data']
      >({
        showError: true,
        maxAttempts: 2,
        async fetch() {
          return SignUpService.getSaved();
        },
      }),
      async getConfirmationWords({ data }) {
        if (!data?.mnemonic) throw new Error('Invalid mnemonic');
        return SignUpService.getWordsToConfirm({ data });
      },
      async confirmMnemonic({ data }) {
        if (!data?.mnemonic) throw new Error('Invalid mnemonic');
        return SignUpService.confirmMnemonic({
          data: {
            mnemonic: data.mnemonic,
            positions: data.positionsForConfirmation,
          },
        });
      },
    },
  }
);

export type SignUpMachine = typeof signUpMachine;
export type SignUpMachineService = InterpreterFrom<SignUpMachine>;
export type SignUpMachineState = StateFrom<SignUpMachine>;
