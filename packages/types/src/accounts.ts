import type { BigNumberish, BN } from 'fuels';

import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  name: string;
  address: string;
  vaultId?: number;
  publicKey: string;
  isHidden?: boolean;
  balance?: BigNumberish | BN;
  balanceSymbol?: string;
  balances?: Coin[];
  isCurrent?: boolean;
};

export enum AddressType {
  contract,
  account,
}
