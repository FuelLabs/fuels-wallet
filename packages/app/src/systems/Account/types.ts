export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  vaultKey?: string;
  name: string;
  address: string;
  isHidden?: boolean;
  balance?: bigint;
  balanceSymbol?: string;
};
