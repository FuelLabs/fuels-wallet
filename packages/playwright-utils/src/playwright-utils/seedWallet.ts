import type { BN, TxParamsType } from 'fuels';
import { Address, Provider, Wallet, bn } from 'fuels';

export async function seedWallet(
  address: string,
  amount: BN,
  fuelProviderUrl: string,
  genesisSecret: string,
  options: TxParamsType = {}
) {
  const fuelProvider = await Provider.create(fuelProviderUrl);
  const baseAssetId = fuelProvider.getBaseAssetId();
  const genesisWallet = Wallet.fromPrivateKey(genesisSecret!, fuelProvider);
  const parameters: TxParamsType = { gasLimit: bn(100_000), ...options };
  console.log(
    `asd SECRET wallet sending funds(${amount.format()} ETH) to Master wallet`,
    genesisWallet.address.toString()
  );

  const transferPromise = genesisWallet.transfer(
    Address.fromString(address),
    amount,
    baseAssetId,
    parameters
  );

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error('Funding Master wallet did not complete after 10 seconds')
        ),
      10000
    );
  });

  const response = await Promise.race([transferPromise, timeoutPromise]);
  await response.wait();
}
