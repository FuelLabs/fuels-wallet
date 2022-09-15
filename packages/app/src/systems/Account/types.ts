import type { BigNumberish, CoinQuantity } from 'fuels';

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
  balances?: CoinQuantity[];
};
