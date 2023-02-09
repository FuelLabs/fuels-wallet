import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountsMachine } from '../Account';
import type { NetworksMachine } from '../Network';
import type { OverlayMachine } from '../Overlay';

export enum Services {
  accounts = 'accounts',
  networks = 'networks',
  overlay = 'overlay',
}

export type StoreMachines = {
  accounts: AccountsMachine;
  networks: NetworksMachine;
  overlay: OverlayMachine;
};

export type Store = StoreClass<StoreMachines>;
