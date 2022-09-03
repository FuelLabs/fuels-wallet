import type { CoinQuantity } from "fuels";

export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  name: string;
  address: string;
  publicKey: string;
  isHidden?: boolean;
  balance?: bigint;
  balanceSymbol?: string;
  balances?: CoinQuantity[];
};
