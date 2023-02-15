import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountsMachine } from '../Account';
import type { AssetsMachine } from '../Asset';
import type { NetworksMachine } from '../Network';
import type { OverlayMachine } from '../Overlay';

export enum Services {
  accounts = 'accounts',
  networks = 'networks',
  assets = 'assets',
  overlay = 'overlay',
}

export type StoreMachines = {
  accounts: AccountsMachine;
  networks: NetworksMachine;
  assets: AssetsMachine;
  overlay: OverlayMachine;
};

export type Store = StoreClass<StoreMachines>;
