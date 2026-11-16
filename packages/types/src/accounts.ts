import type { BN } from 'fuels';
import type { AssetFuelData } from './asset';
import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export interface CoinAsset extends Coin {
  asset?: AssetFuelData;
}

export type Account = {
  name: string;
  address: string;
  vaultId?: number;
  publicKey: string;
  isHidden?: boolean;
  isCurrent?: boolean;
  /** When the account was last made current, in ms. Lists order by it. */
  lastUsedAt?: number;
};

export type AccountBalance = {
  balance: BN;
  balanceSymbol: string;
  amountInUsd: string | undefined;
  totalBalanceInUsd: number;
  balances: CoinAsset[];
};

export type AccountWithBalance = Account & AccountBalance;
