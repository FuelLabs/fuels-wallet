import type { BN } from 'fuels';

import type { AssetFuelData } from './asset';
import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export interface CoinAsset extends Coin {
  asset?: AssetFuelData & {
    indexed?: boolean;
    suspicious?: boolean;
    isNft?: boolean;
  };
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
