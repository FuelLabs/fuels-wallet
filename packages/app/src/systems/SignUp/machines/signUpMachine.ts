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
  mnemonicConfirmation?: string[];
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
  getPositionsToConfirm: {
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
  | { type: 'CANCEL' }
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
            target: 'recoveringWallet',
            cond: 'isRecoveringWallet',
          },
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
            actions: ['assignError', 'assignNoPositionsToConfirm'],
            target: 'waitingMnemonic',
          },
        },
      },
      showingMnemonic: {
        on: {
          NEXT: {
            target: 'fetchingConfirmationWords',
          },
          CANCEL: {
            target: 'cancel',
          },
        },
      },
      fetchingConfirmationWords: {
        invoke: {
          src: 'getPositionsToConfirm',
          onDone: {
            actions: ['assignConfirmWalletData'],
            target: 'waitingMnemonic',
          },
          onError: {
            actions: ['assignError'],
            target: 'cancel',
          },
        },
      },
      waitingMnemonic: {
        initial: 'idle',
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
                "The seed phrase doesn't match. Please check the order of words and try again"
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
          idle: {
            entry: ['cleanError'],
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
          CANCEL: {
            target: 'cancel',
          },
        },
      },
      confirmingMnemonic: {
        tags: ['loading'],
        invoke: {
          src: 'confirmMnemonic',
          onDone: {
            target: 'waitingMnemonic.validMnemonic',
          },
          onError: {
            target: 'waitingMnemonic.mnemonicNotMatch',
            actions: 'assignError',
          },
        },
      },
      addingPassword: {
        on: {
          CREATE_PASSWORD: {
            target: '#(machine).savingPassword',
            actions: ['assignPassword', 'createMnemonic'],
          },
          CANCEL: {
            target: 'cancel',
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
      cancel: {
        invoke: {
          src: 'deleteSavedSignUp',
          onDone: {
            actions: 'refreshPage',
            target: 'idle',
          },
        },
      },
      recoveringWallet: {
        initial: 'addingPassword',
        states: {
          enteringMnemonic: {
            initial: 'idle',
            states: {
              invalidMnemonic: {
                entry: [
                  assignErrorMessage(
                    'The seed phrase is not valid check the words for typos or missing words'
                  ),
                ],
              },
              validMnemonic: {
                entry: ['cleanError'],
                on: {
                  NEXT: {
                    target: '#(machine).creatingWallet',
                  },
                },
              },
              idle: {
                on: {
                  CONFIRM_MNEMONIC: {
                    actions: ['assignIsFilled', 'assignMnemonicWhenRecovering'],
                    target: 'validMnemonic',
                  },
                },
              },
            },
          },
          addingPassword: {
            on: {
              CREATE_PASSWORD: {
                actions: 'assignPassword',
                target: 'enteringMnemonic',
              },
            },
          },
          creatingWallet: {
            tags: ['loading'],
            invoke: {
              src: 'setupVault',
              onDone: {
                actions: ['assignAccount', 'deleteData', 'sendAccountCreated'],
                target: '#(machine).done',
              },
              onError: {
                actions: 'assignError',
                target: '#(machine).failed',
              },
            },
          },
        },
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
            ? {
                ...ctx.data,
                mnemonic: ev.data.words,
              }
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
          positionsForConfirmation: ev.data.positions,
          // mnemonicConfirmation: removePositionsFromMnemonic(
          //   ev.data?.positions || [],
          //   ctx.data?.mnemonic || []
          // ),
        }),
      }),
      assignConfirmationWords: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          mnemonicConfirmation: ev.data.words,
        }),
      }),
      assignNoPositionsToConfirm: assign({
        data: (ctx) => ({
          ...ctx.data,
          positionsForConfirmation: [],
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
      refreshPage: () => {},
    },
    guards: {
      isCreatingWallet: (ctx) => {
        return ctx.type === SignUpType.create;
      },
      hasSavedMnemonic: () => {
        return SignUpService.hasSaved();
      },
      isRecoveringWallet: (ctx) => {
        return ctx.type === SignUpType.recover;
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
        showError: false,
        maxAttempts: 2,
        async fetch() {
          const savedData = await SignUpService.getSaved();
          return savedData;
        },
      }),
      async getPositionsToConfirm({ data }) {
        if (!data?.mnemonic) throw new Error('Invalid mnemonic');
        const words = await SignUpService.getPositionsToConfirm({ data });
        return words;
      },
      async confirmMnemonic({ data }) {
        if (!data?.mnemonic) throw new Error('Invalid mnemonic');
        const isValid = await SignUpService.confirmMnemonic({
          data: {
            mnemonic: data.mnemonicConfirmation,
          },
        });
        if (!isValid) throw new Error('Invalid mnemonic');
        return isValid;
      },
      async deleteSavedSignUp() {
        const deleted = await SignUpService.deleteSaved();
        return deleted;
      },
    },
  }
);

export type SignUpMachine = typeof signUpMachine;
export type SignUpMachineService = InterpreterFrom<SignUpMachine>;
export type SignUpMachineState = StateFrom<SignUpMachine>;
