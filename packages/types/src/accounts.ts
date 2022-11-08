import type { BigNumberish } from 'fuels';

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
  balance?: BigNumberish;
  balanceSymbol?: string;
  balances?: Coin[];
};

export enum AddressType {
  contract,
  account,
}
