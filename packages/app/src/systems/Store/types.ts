import type { StoreClass } from '@fuels/react-xstore';

import type { AccountsMachine } from '../Account';
import type { AssetsMachine } from '../Asset';
import type {
  AddAssetMachine,
  AddNetworkRequestMachine,
  ConnectRequestMachine,
  MessageRequestMachine,
  TransactionRequestMachine,
} from '../DApp';
import type { ReportErrorMachine } from '../Error';
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
  reportError = 'reportError',
  addNetworkRequest = 'addNetworkRequest',
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
  reportError: ReportErrorMachine;
  addNetworkRequest: AddNetworkRequestMachine;
};

export type Store = StoreClass<StoreMachines>;
