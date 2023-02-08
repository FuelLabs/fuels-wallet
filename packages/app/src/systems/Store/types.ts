import type { AccountMachine } from '../Account';
import type { NetworksMachine } from '../Network';

export enum Services {
  accounts = 'accounts',
  accountsDialog = 'accountsDialog',
  networks = 'networks',
}

export type StoreMachines = {
  accounts: AccountMachine;
  accountsDialog: AccountMachine;
  networks: NetworksMachine;
};
