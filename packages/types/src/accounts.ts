import type { AssetFuel, BN, BigNumberish } from 'fuels';

import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export type CoinAsset = Coin & { asset?: AssetFuel };

export type Account = {
  name: string;
  address: string;
  vaultId?: number;
  publicKey: string;
  isHidden?: boolean;
  balance?: BigNumberish | BN;
  balanceSymbol?: string;
  balances?: CoinAsset[];
  isCurrent?: boolean;
};
