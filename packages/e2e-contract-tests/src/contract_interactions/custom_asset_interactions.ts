import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type { BigNumberish } from 'fuels';
import { BaseAssetId } from 'fuels';

import { VITE_MINT_CONTRACT_ID } from '../config';
import { CustomAssetAbi__factory } from '../contracts';
import type { IdentityInput } from '../contracts/CustomAssetAbi';

const CONTRACT_ID = VITE_MINT_CONTRACT_ID;

export const mint = async ({
  wallet,
  amount,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
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

export const forwardEth = async ({
  wallet,
  amount,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  await contract.functions
    .deposit()
    .callParams({ forward: [amount, BaseAssetId] })
    .call();
};
