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

export enum AccountType {
  IMPORTED = 'imported',
  DERIVED = 'derived',
  READ_ONLY = 'read-only',
}

export type Account = {
  type: AccountType;
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
  amountInUsd: string | undefined;
  totalBalanceInUsd: number;
  balances: CoinAsset[];
};

export type AccountWithBalance = Account & AccountBalance;
