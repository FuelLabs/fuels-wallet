import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type { BigNumberish } from 'fuels';
import { bn, BaseAssetId } from 'fuels';
import toast from 'react-hot-toast';

import { MAIN_CONTRACT_ID, EXTERNAL_CONTRACT_ID } from '../config';
import { CustomAssetAbi__factory } from '../contracts';
import type { IdentityInput } from '../contracts/contracts/CustomAssetAbi';

const TX_PARAMS = { gasPrice: 1, gasLimit: bn(1_000_000) };

export const mint = async ({
  wallet,
  amount,
  subId,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
  subId: string;
}) => {
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  const invokeScope = await contract.functions
    .mint(recipient, subId, amount)
    .txParams(TX_PARAMS);

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
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
  const result = await contract.functions
    .deposit()
    .callParams({ forward: [amount, assetId] })
    .txParams(TX_PARAMS)
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
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
  const result = await contract.functions
    .deposit_half()
    .callParams({ forward: [amount, assetId] })
    .txParams(TX_PARAMS)
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
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  const result = await contract.functions
    .deposit_half_and_mint(recipient, BaseAssetId, mintAmount)
    .callParams({ forward: [forwardAmount, assetId] })
    .txParams(TX_PARAMS)
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
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };

  const externalContract = CustomAssetAbi__factory.connect(
    EXTERNAL_CONTRACT_ID,
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
    .txParams(TX_PARAMS)
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
  const contract = CustomAssetAbi__factory.connect(MAIN_CONTRACT_ID, wallet);
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
    .txParams(TX_PARAMS)
    .call();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};
