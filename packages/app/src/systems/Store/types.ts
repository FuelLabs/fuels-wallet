import type { AccountsDialogMachine, AccountsMachine } from '../Account';
import type { NetworksMachine } from '../Network';

export enum Services {
  accounts = 'accounts',
  accountsDialog = 'accountsDialog',
  networks = 'networks',
}

export type StoreMachines = {
  accounts: AccountsMachine;
  accountsDialog: AccountsDialogMachine;
  networks: NetworksMachine;
};
