import { Provider, Wallet } from 'fuels';

import { FUEL_PROVIDER_URL } from '~/config';

export async function getBalances(key: string = '0x00') {
  const provider = new Provider(FUEL_PROVIDER_URL);
  const wallet = new Wallet(key, provider);
  const balances = await wallet.getBalances();

  return balances;
}
