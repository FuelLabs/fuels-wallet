import type { Account, BigNumberish } from 'fuels';
import { bn } from 'fuels';
import toast from 'react-hot-toast';

import { EXTERNAL_CONTRACT_ID, MAIN_CONTRACT_ID } from '../config';
import { CustomAsset } from '../contracts';
import type { IdentityInput } from '../contracts/contracts/CustomAssetAbi';

const TX_PARAMS = { gasPrice: 1, gasLimit: bn(1_000_000) };

const getAssetContract = (wallet: Account) =>
  new CustomAsset(MAIN_CONTRACT_ID, wallet);
const getExternalAssetContract = (wallet: Account) =>
  new CustomAsset(EXTERNAL_CONTRACT_ID, wallet);

export const mint = async ({
  wallet,
  amount,
  subId,
}: {
  wallet: Account;
  amount: BigNumberish;
  subId: string;
}) => {
  const contract = getAssetContract(wallet);
  const recipient: IdentityInput = {
    Address: {
      bits: wallet.address.toB256(),
    },
  };
  const invokeScope = await contract.functions
    .mint(recipient, subId, amount)
    .txParams(TX_PARAMS);

  const { waitForResult } = await invokeScope.call();
  const result = await waitForResult();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const deposit = async ({
  wallet,
  amount,
  assetId,
}: {
  wallet: Account;
  amount: BigNumberish;
  assetId: string;
}) => {
  const contract = getAssetContract(wallet);
  const { waitForResult } = await contract.functions
    .deposit()
    .callParams({ forward: [amount, assetId] })
    .txParams(TX_PARAMS)
    .call();
  const result = await waitForResult();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositHalf = async ({
  wallet,
  amount,
  assetId,
}: {
  wallet: Account;
  amount: BigNumberish;
  assetId: string;
}) => {
  const contract = getAssetContract(wallet);
  const { waitForResult } = await contract.functions
    .deposit_half()
    .callParams({ forward: [amount, assetId] })
    .txParams(TX_PARAMS)
    .call();
  const result = await waitForResult();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositHalfAndMint = async ({
  wallet,
  forwardAmount,
  mintAmount,
  assetId,
  baseAssetId,
}: {
  wallet: Account;
  forwardAmount: BigNumberish;
  mintAmount: BigNumberish;
  assetId: string;
  baseAssetId: string;
}) => {
  const contract = getAssetContract(wallet);
  const recipient: IdentityInput = {
    Address: {
      bits: wallet.address.toB256(),
    },
  };
  const { waitForResult } = await contract.functions
    .deposit_half_and_mint(recipient, baseAssetId, mintAmount)
    .callParams({ forward: [forwardAmount, assetId] })
    .txParams(TX_PARAMS)
    .call();
  const result = await waitForResult();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositHalfAndExternalMint = async ({
  wallet,
  forwardAmount,
  mintAmount,
  assetId,
  baseAssetId,
}: {
  wallet: Account;
  forwardAmount: BigNumberish;
  mintAmount: BigNumberish;
  assetId: string;
  baseAssetId: string;
}) => {
  const contract = getAssetContract(wallet);
  const recipient: IdentityInput = {
    Address: {
      bits: wallet.address.toB256(),
    },
  };

  const externalContract = getExternalAssetContract(wallet);
  const { waitForResult } = await contract.functions
    .deposit_half_and_mint_from_external_contract(
      recipient,
      baseAssetId,
      mintAmount,
      { bits: externalContract.id.toB256() }
    )
    .callParams({ forward: [forwardAmount, assetId] })
    .addContracts([externalContract])
    .txParams(TX_PARAMS)
    .call();
  const result = await waitForResult();

  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const depositAndMintMultiCall = async ({
  wallet,
  forwardAmount,
  mintAmount,
  assetId,
  baseAssetId,
}: {
  wallet: Account;
  forwardAmount: BigNumberish;
  mintAmount: BigNumberish;
  assetId: string;
  baseAssetId: string;
}) => {
  const contract = getAssetContract(wallet);
  const recipient: IdentityInput = {
    Address: {
      bits: wallet.address.toB256(),
    },
  };

  const { waitForResult } = await contract
    .multiCall([
      contract.functions
        .deposit()
        .callParams({ forward: [forwardAmount, assetId] }),
      contract.functions.mint(recipient, baseAssetId, mintAmount),
    ])
    .txParams(TX_PARAMS)
    .call();
  const result = await waitForResult();
  if (result.transactionResult.isStatusSuccess) {
    toast.success('Transaction successful.');
  }
};

export const panicTx = async ({ wallet }: { wallet: Account }) => {
  const contract = getAssetContract(wallet);
  try {
    await contract.functions.panic_tx().txParams(TX_PARAMS).call();
  } catch (err) {
    toast.error((err as Error).message);
  }
};

export const revertTx = async ({ wallet }: { wallet: Account }) => {
  const contract = getAssetContract(wallet);
  try {
    await contract.functions.revert_tx().txParams(TX_PARAMS).call();
  } catch (err) {
    toast.error((err as Error).message);
  }
};
