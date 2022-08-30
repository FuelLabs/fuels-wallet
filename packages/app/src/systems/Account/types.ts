export type Vault = {
  key: string;
  data: string;
};

export type Account = {
  name: string;
  address: string;
  isHidden?: boolean;
  balance?: bigint;
  balanceSymbol?: string;
};
