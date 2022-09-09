import { Address, Provider } from 'fuels';

import { FUEL_PROVIDER_URL } from '~/config';

export async function getBalances(publicKey: string = '0x00') {
  const provider = new Provider(FUEL_PROVIDER_URL);
  const address = Address.fromPublicKey(publicKey);
  const balances = await provider.getBalances(address);

  return balances;
}
