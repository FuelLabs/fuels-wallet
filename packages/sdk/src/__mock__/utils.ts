import type { BigNumberish } from 'fuels';
import { NativeAssetId, Address, Wallet } from 'fuels';

export async function seedWallet(address: string, amount: BigNumberish) {
  const genesisWallet = Wallet.fromPrivateKey(
    process.env.PUBLIC_GENESIS_SECRET!,
    process.env.PUBLIC_PROVIDER_URL!
  );
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    NativeAssetId,
    { gasPrice: 1 }
  );
  await response.wait();
}
