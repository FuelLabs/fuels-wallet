import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountsMachine } from '../Account';
import type { AssetsMachine } from '../Asset';
import type {
  TransactionRequestMachine,
  MessageRequestMachine,
  ConnectRequestMachine,
  AddAssetMachine,
} from '../DApp';
import type { NetworksMachine } from '../Network';
import type { OverlayMachine } from '../Overlay';
import type { UnlockMachine } from '../Unlock';

export enum Services {
  account = 'account',
  accounts = 'accounts',
  networks = 'networks',
  assets = 'assets',
  overlay = 'overlay',
  unlock = 'unlock',
  txRequest = 'txRequest',
  msgRequest = 'msgRequest',
  connectRequest = 'connectRequest',
  addAssetRequest = 'addAssetRequest',
}

export type StoreMachines = {
  accounts: AccountsMachine;
  networks: NetworksMachine;
  assets: AssetsMachine;
  overlay: OverlayMachine;
  unlock: UnlockMachine;
  txRequest: TransactionRequestMachine;
  msgRequest: MessageRequestMachine;
  connectRequest: ConnectRequestMachine;
  addAssetRequest: AddAssetMachine;
};

export type Store = StoreClass<StoreMachines>;
