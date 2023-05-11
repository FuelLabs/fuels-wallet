import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AccountService } from '../services/account';

import { store } from '~/store';
import { FetchMachine } from '~/systems/Core';
import { VaultService } from '~/systems/Vault';

type MachineContext = {
  accountName?: string;
};

type MachineServices = {
  addAccount: {
    data: Account;
  };
};

export type AddAccountMachineEvents = {
  type: 'ADD_ACCOUNT';
  input: string;
};

export const addAccountMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./addAccountMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as AddAccountMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD_ACCOUNT: {
            actions: ['assignAccountName'],
            target: 'addingAccount',
          },
        },
      },
      addingAccount: {
        tags: ['loading'],
        invoke: {
          src: 'addAccount',
          data: {
            input: (ctx: MachineContext) => ({
              name: ctx.accountName,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      assignAccountName: assign({
        accountName: (_, ev) => ev.input,
      }),
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome() {
        store.closeOverlay();
      },
    },
    services: {
      addAccount: FetchMachine.create<{ name: string }, Account>({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.name.trim()) {
            throw new Error('Name cannot be empty');
          }
          const { name } = input;

          if (await AccountService.checkAccountNameExists(name)) {
            throw new Error('Account name already exists');
          }

          // Add account to vault
          const accountVault = await VaultService.addAccount({
            // TODO: remove this when we have multiple vaults
            // https://github.com/FuelLabs/fuels-wallet/issues/562
            vaultId: 0,
          });

          // Add account to the database
          let account = await AccountService.addAccount({
            data: {
              ...input,
              ...accountVault,
            },
          });

          // set as active account
          account = await AccountService.setCurrentAccount({
            address: account.address.toString(),
          });

          return account;
        },
      }),
    },
  }
);

export type AddAccountMachine = typeof addAccountMachine;
export type AddAccountMachineService = InterpreterFrom<AddAccountMachine>;
export type AddAccountMachineState = StateFrom<AddAccountMachine>;
