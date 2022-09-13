import type { BigNumberish } from 'fuels';

export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  name: string;
  address: string;
  isHidden?: boolean;
  balance?: BigNumberish;
  balanceSymbol?: string;
};
