import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type { BigNumberish } from 'fuels';
import { BaseAssetId } from 'fuels';

import { VITE_CONTRACT_ID } from '../config';
import { CustomAssetAbi__factory } from '../contracts';
import type { IdentityInput } from '../contracts/CustomAssetAbi';

const CONTRACT_ID = VITE_CONTRACT_ID;

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

export const deposit = async ({
  wallet,
  amount,
  assetId,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
  assetId: string;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  await contract.functions
    .deposit()
    .callParams({ forward: [amount, assetId] })
    .call();
};

export const depositHalf = async ({
  wallet,
  amount,
  assetId,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
  assetId: string;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  await contract.functions
    .deposit_half()
    .callParams({ forward: [amount, assetId] })
    .call();
};

export const depositHalfAndMint = async ({
  wallet,
  forwardAmount,
  mintAmount,
  assetId,
}: {
  wallet: FuelWalletLocked;
  forwardAmount: BigNumberish;
  mintAmount: BigNumberish;
  assetId: string;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  await contract.functions
    .deposit_half_and_mint(recipient, BaseAssetId, mintAmount)
    .callParams({ forward: [forwardAmount, assetId] })
    .call();
};
