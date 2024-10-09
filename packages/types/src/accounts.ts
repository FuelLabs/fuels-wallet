import type { AssetFuel, BN } from 'fuels';

import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export interface CoinAsset extends Coin {
  asset?: AssetFuel;
}

export type Account = {
  name: string;
  address: string;
  vaultId?: number;
  publicKey: string;
  isHidden?: boolean;
  isCurrent?: boolean;
};

export type AccountBalance = {
  balance: BN;
  balanceSymbol: string;
  balances: CoinAsset[];
};

export type AccountWithBalance = Account & AccountBalance;
