import { toast } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';
import { store } from '~/store';
import { FetchMachine } from '~/systems/Core';
import { VaultService } from '~/systems/Vault';

import { AccountService } from '../services/account';

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
};

export const addAccountMachine = createMachine(
  {
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
              actions: [
                'notifyUpdateAccounts',
                'redirectToHome',
                'showSuccessNotification',
              ],
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
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
      redirectToHome() {
        store.closeOverlay();
      },
      showSuccessNotification: (_, ev) => {
        const { name } = ev.data;
        toast.success(` ${name || 'Account'} created`);
      },
    },
    services: {
      addAccount: FetchMachine.create<never, Account>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          const name = await AccountService.generateAccountName();

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
              name,
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
