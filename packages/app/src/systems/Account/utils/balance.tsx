import type { Account } from '@fuel-wallet/types';
import { bn } from 'fuels';

export function getBalance(account: Account, assetId: string) {
  const balances = account.balances || [];
  const asset = balances.find((balance) => balance.assetId === assetId);
  return bn(asset?.amount);
}
