import { Address, Provider } from 'fuels';

import { VITE_FUEL_PROVIDER_URL } from '~/config';

export async function getBalances(publicKey: string = '0x00') {
  const provider = new Provider(VITE_FUEL_PROVIDER_URL);
  const address = Address.fromPublicKey(publicKey);
  return provider.getBalances(address);
}
