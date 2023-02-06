import type { AccountMachine } from '../Account';
import type { NetworksMachine } from '../Network';

export enum Services {
  accounts = 'accounts',
  networks = 'networks',
}

export type StoreMachines = {
  accounts: AccountMachine;
  networks: NetworksMachine;
};
