import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type { BigNumberish } from 'fuels';
import { BaseAssetId } from 'fuels';
import toast from 'react-hot-toast';

import { VITE_CONTRACT_ID, VITE_EXTERNAL_CONTRACT_ID } from '../config';
import { CustomAssetAbi__factory } from '../contracts';
import type { IdentityInput } from '../contracts/CustomAssetAbi';

const CONTRACT_ID = VITE_CONTRACT_ID;

export const mint = async ({
  wallet,
  amount,
  subId,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
  subId: string;
}) => {
  const contract = CustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  const invokeScope = await contract.functions
    .mint(recipient, subId, amount)
    .txParams({ gasPrice: 1 });

  const result = await invokeScope.call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
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
  const result = await contract.functions
    .deposit()
    .callParams({ forward: [amount, assetId] })
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
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
  const result = await contract.functions
    .deposit_half()
    .callParams({ forward: [amount, assetId] })
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
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
  const result = await contract.functions
    .deposit_half_and_mint(recipient, BaseAssetId, mintAmount)
    .callParams({ forward: [forwardAmount, assetId] })
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositHalfAndExternalMint = async ({
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

  const externalContract = CustomAssetAbi__factory.connect(
    VITE_EXTERNAL_CONTRACT_ID,
    wallet
  );
  const result = await contract.functions
    .deposit_half_and_mint_from_external_contract(
      recipient,
      BaseAssetId,
      mintAmount,
      { value: externalContract.id.toB256() }
    )
    .callParams({ forward: [forwardAmount, assetId] })
    .addContracts([externalContract])
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositAndMintMultiCall = async ({
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

  const result = await contract
    .multiCall([
      contract.functions
        .deposit()
        .callParams({ forward: [forwardAmount, assetId] }),
      contract.functions.mint(recipient, BaseAssetId, mintAmount),
    ])
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};
