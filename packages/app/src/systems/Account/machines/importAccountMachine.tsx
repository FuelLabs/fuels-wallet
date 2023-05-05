import type { Account } from '@fuel-wallet/types';
import { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import type { AccountInputs } from '../services/account';
import { AccountService } from '../services/account';

import { store } from '~/store';
import { FetchMachine } from '~/systems/Core';
import { VaultService } from '~/systems/Vault';

type MachineServices = {
  importAccount: {
    data: Account;
  };
};

export type ImportAccountMachineEvents = {
  type: 'IMPORT_ACCOUNT';
  input: AccountInputs['importAccount'];
};

export const importAccountMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./importAccountMachine.typegen').Typegen0,
    schema: {
      context: {},
      services: {} as MachineServices,
      events: {} as ImportAccountMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          IMPORT_ACCOUNT: {
            target: 'importingAccount',
          },
        },
      },
      importingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'importAccount',
          data: {
            input: (_: never, ev: ImportAccountMachineEvents) => ev.input,
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome() {
        store.closeOverlay();
      },
    },
    services: {
      importAccount: FetchMachine.create<
        AccountInputs['importAccount'],
        MachineServices['importAccount']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.privateKey.trim()) {
            throw new Error('Private key cannot be empty');
          }
          const name = await AccountService.generateAccountName();

          // Check if account exists
          const accounts = await AccountService.getAccounts();
          const wallet = Wallet.fromPrivateKey(input.privateKey);
          const exists = accounts.find((account) => {
            return account.address.toString() === wallet.address.toString();
          });
          if (exists) {
            throw new Error('Account already imported!');
          }

          // Add account to vault
          const accountVault = await VaultService.createVault({
            type: 'privateKey',
            secret: input.privateKey,
          });

          // Add account to the database
          const account = await AccountService.addAccount({
            data: {
              name,
              address: accountVault.address.toString(),
              publicKey: accountVault.publicKey,
              isHidden: false,
              vaultId: accountVault.vaultId,
            },
          });

          // set as active account
          const activeAccount = await AccountService.setCurrentAccount({
            address: account.address.toString(),
          });

          return activeAccount;
        },
      }),
    },
  }
);

export type ImportAccountMachine = typeof importAccountMachine;
export type ImportAccountMachineService = InterpreterFrom<ImportAccountMachine>;
export type ImportAccountMachineState = StateFrom<ImportAccountMachine>;
