import type { Account } from '@fuel-wallet/types';
import { Mnemonic } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { IS_LOGGED_KEY, MNEMONIC_SIZE } from '~/config';
import { store } from '~/store';
import {
  Storage,
  assignErrorMessage,
  getPhraseFromValue,
  getWordsFromValue,
} from '~/systems/Core';
import type { Maybe } from '~/systems/Core';

import { SignUpService } from '../services';

// ----------------------------------------------------------------------------
// Machine
// ----------------------------------------------------------------------------

export enum SignUpType {
  create = 'CREATE',
  import = 'IMPORT',
}

export const ERRORS = {
  seedPhraseMatchError:
    "The Seed Phrase doesn't match. Check the phrase for typos or missing words",
  seedPhraseInvalidError:
    'The Seed Phrase is not valid. Check the words for typos or missing words',
};

type FormValues = {
  mnemonic?: string[];
  password?: string;
};

type MachineContext = {
  signUpType?: Maybe<SignUpType>;
  isFilled?: boolean;
  isValidMnemonic?: boolean;
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
  | { type: 'CREATE' }
  | { type: 'IMPORT' }
  | { type: 'RESET' }
  | { type: 'PREVIOUS' }
  | { type: 'IMPORT_MNEMONIC'; data: { words: string[] } }
  | { type: 'CONFIRM_MNEMONIC'; data: { words: string[] } }
  | { type: 'CREATE_MANAGER'; data: { password: string } };

export const signUpMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./signUpMachine.typegen').Typegen0,
    id: '(machine)',
    initial: 'atWelcome',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    context: {},
    states: {
      atWelcome: {
        on: {
          CREATE: {
            actions: ['assignCreate'],
            target: 'aggrement',
          },
          IMPORT: {
            actions: ['assignImport'],
            target: 'aggrement',
          },
        },
      },
      aggrement: {
        on: {
          NEXT: [
            {
              cond: 'isCreate',
              target: 'create',
            },
            {
              cond: 'isImport',
              target: 'import',
            },
          ],
        },
      },
      import: {
        on: {
          IMPORT_MNEMONIC: [
            {
              cond: 'isNotValidMnemonic',
              actions: [assignErrorMessage(ERRORS.seedPhraseInvalidError)],
              target: 'import',
            },
            {
              actions: ['cleanError', 'deleteData', 'assignMnemonic'],
              target: '#(machine).addingPassword',
            },
          ],
        },
      },
      create: {
        onEntry: ['cleanError', 'deleteData', 'createMnemonic'],
        initial: 'showingMnemonic',
        states: {
          showingMnemonic: {
            on: {
              NEXT: {
                target: 'confirmMnemonic',
              },
            },
          },
          confirmMnemonic: {
            on: {
              CONFIRM_MNEMONIC: [
                {
                  cond: 'notMatchMnemonic',
                  actions: [assignErrorMessage(ERRORS.seedPhraseMatchError)],
                  target: 'confirmMnemonic',
                },
                {
                  actions: ['cleanError'],
                  target: '#(machine).addingPassword',
                },
              ],
              PREVIOUS: {
                target: 'showingMnemonic',
              },
            },
          },
        },
      },
      addingPassword: {
        on: {
          CREATE_MANAGER: {
            target: 'creatingWallet',
            actions: 'assignPassword',
          },
          PREVIOUS: {
            target: '#(machine).create.confirmMnemonic',
          },
        },
      },
      creatingWallet: {
        tags: ['loading'],
        invoke: {
          src: 'setupVault',
          onDone: {
            actions: ['deleteData', 'sendAccountCreated'],
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
        actions: ['redirectToWelcome'],
      },
    },
  },
  {
    actions: {
      // Assign Type
      assignCreate: assign({
        signUpType: (_) => SignUpType.create,
      }),
      assignImport: assign({
        signUpType: (_) => SignUpType.import,
      }),
      // Error
      cleanError: assign({
        error: (_) => undefined,
      }),
      assignError: assign({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        error: (_, ev) => ev.data as any,
      }),
      // Data
      deleteData: assign({
        data: (_) => null,
      }),
      // Mnemonic
      createMnemonic: assign({
        data: (_) => ({
          mnemonic: getWordsFromValue(Mnemonic.generate(MNEMONIC_SIZE)),
        }),
      }),
      assignMnemonic: assign({
        data: (_, ev) => ({
          mnemonic: getWordsFromValue(ev.data.words),
        }),
      }),
      // Passowrd
      assignPassword: assign({
        data: (ctx, ev) => ({
          ...ctx.data,
          password: ev.data.password,
        }),
      }),
      // External actions
      sendAccountCreated: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
        store.refreshAccounts();
      },
      redirectToWalletCreated() {},
    },
    guards: {
      isCreate: (ctx) => ctx.signUpType === SignUpType.create,
      isImport: (ctx) => ctx.signUpType === SignUpType.import,
      isNotValidMnemonic: (_, ev) => {
        return !Mnemonic.isMnemonicValid(
          getPhraseFromValue(ev.data.words) || ''
        );
      },
      notMatchMnemonic: (ctx, ev) => {
        return (
          getPhraseFromValue(ev.data.words) !==
          getPhraseFromValue(ctx.data?.mnemonic)
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
