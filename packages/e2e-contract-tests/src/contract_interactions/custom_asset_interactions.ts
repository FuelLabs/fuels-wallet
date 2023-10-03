import { FuelWalletLocked } from '@fuel-wallet/sdk';
import { BaseAssetId, BigNumberish } from 'fuels';
import { VITE_MINT_CONTRACT_ID } from '../config';
import { MintCustomAssetAbi__factory } from '../contracts';
import { IdentityInput } from '../contracts/MintCustomAssetAbi';

const CONTRACT_ID = VITE_MINT_CONTRACT_ID;

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
