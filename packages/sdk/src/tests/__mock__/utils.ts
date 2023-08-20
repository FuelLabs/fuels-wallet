import type { BN } from 'fuels';
import { BaseAssetId, Address, Wallet } from 'fuels';

import { getGasConfig } from '../../utils';

export async function seedWallet(address: string, amount: BN) {
  const genesisWallet = Wallet.fromPrivateKey(
    process.env.PUBLIC_GENESIS_SECRET!,
    process.env.PUBLIC_PROVIDER_URL!
  );
  const { gasLimit, gasPrice } = await getGasConfig(genesisWallet.provider);
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasLimit, gasPrice }
  );
  await response.wait();
}
