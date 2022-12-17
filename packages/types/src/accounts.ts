import type { BigNumberish, BN } from 'fuels';

import type { Coin } from './coin';

export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  name: string;
  address: string;
  publicKey: string;
  isHidden?: boolean;
  balance?: BigNumberish | BN;
  balanceSymbol?: string;
  balances?: Coin[];
  isSelected?: boolean;
};

export enum AddressType {
  contract = 'Contract',
  account = 'Account',
}
