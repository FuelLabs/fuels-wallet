import type { BigNumberish } from 'fuels';

import type { Asset } from '~/systems/Asset';

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
  balances?: Asset[];
};
