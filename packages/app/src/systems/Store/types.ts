import type { AccountMachine } from '../Account';
import type { AssetsMachine } from '../Asset';
import type { NetworksMachine } from '../Network';

export enum Services {
  accounts = 'accounts',
  networks = 'networks',
  assets = 'assets',
}

export type StoreMachines = {
  accounts: AccountMachine;
  networks: NetworksMachine;
  assets: AssetsMachine;
};
