import { FuelWalletLocked } from '@fuel-wallet/sdk';
import { BaseAssetId, BigNumberish } from 'fuels';
import { MintCustomAssetAbi__factory } from '../contracts';
import { IdentityInput } from '../contracts/MintCustomAssetAbi';

const CONTRACT_ID =
  '0xc16a66a148bfc1674ba8c4c1b52faae8ced356c880c76ff78e80db565979187a';

export const mint = async ({
  wallet,
  amount,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
}) => {
  const contract = MintCustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  await contract.functions
    .mint(recipient, BaseAssetId, amount)
    .txParams({ gasPrice: 1 })
    .call();
};
