import type { BN } from 'fuels';
import { BaseAssetId, Address, Wallet } from 'fuels';

export async function seedWallet(address: string, amount: BN) {
  const genesisWallet = Wallet.fromPrivateKey(
    process.env.PUBLIC_GENESIS_SECRET!,
    process.env.PUBLIC_PROVIDER_URL!
  );
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice: 1 }
  );
  await response.wait();
}
