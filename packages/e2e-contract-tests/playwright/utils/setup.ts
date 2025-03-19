import { FuelWalletTestHelper, seedWallet } from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import {
  type BNInput,
  type ChangeTransactionRequestOutput,
  Mnemonic,
  OutputType,
  Provider,
  ScriptTransactionRequest,
  Wallet,
  type WalletUnlocked,
  bn,
} from 'fuels';

import '../../load.envs';

const {
  VITE_FUEL_PROVIDER_URL,
  VITE_WALLET_SECRET,
  VITE_MASTER_WALLET_MNEMONIC,
} = process.env;

export const testSetup = async ({
  context,
  extensionId,
  page,
  amountToFund,
}: {
  context: BrowserContext;
  page: Page;
  extensionId: string;
  amountToFund: BNInput;
}) => {
  const pages = context.pages();
  for (const p of pages) {
    if (p !== page) await p.close();
  }
  const fuelProvider = new Provider(VITE_FUEL_PROVIDER_URL!);
  const chainName = (await fuelProvider.getChain()).name;
  const masterWallet = Wallet.fromMnemonic(VITE_MASTER_WALLET_MNEMONIC!);
  masterWallet.connect(fuelProvider);

  console.log('asd Master wallet address:', masterWallet.address.toString());
  if (VITE_WALLET_SECRET) {
    await seedWallet(
      masterWallet.address.toString(),
      bn.parseUnits('1'),
      VITE_FUEL_PROVIDER_URL!,
      VITE_WALLET_SECRET!
    );
  }
  const randomMnemonic = Mnemonic.generate();
  const fuelWallet = Wallet.fromMnemonic(randomMnemonic);
  fuelWallet.connect(fuelProvider);
  console.log(
    `asd Master wallet sending funds(${bn(
      amountToFund
    ).format()} ETH) to test wallet address`
  );
  const txResponse = await masterWallet.transfer(
    fuelWallet.address,
    bn(amountToFund)
  );
  await txResponse.waitForResult();
  console.log('asd Success sending funds');

  const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup({
    context,
    fuelExtensionId: extensionId,
    fuelProvider: {
      url: fuelProvider.url,
      chainId: await fuelProvider.getChainId(),
    },
    chainName,
    mnemonic: randomMnemonic,
  });

  await page.goto('/');
  await page.bringToFront();

  return { fuelWallet, fuelWalletTestHelper, masterWallet };
};

// export const transferMaxBalance = async ({
//   fromWallet,
//   toWallet,
// }: {
//   fromWallet: WalletUnlocked;
//   toWallet: WalletUnlocked;
// }) => {
//   if (!fromWallet || !toWallet) return;

//   const MAX_ATTEMPTS = 10;
//   const trySendMax = async (attempt = 1) => {
//     if (attempt > MAX_ATTEMPTS) return;

//     try {
//       const remainingBalance = await fromWallet.getBalance();
//       const nextSubTry = bn(attempt * 10_000);

//       if (nextSubTry.lt(remainingBalance)) {
//         const targetAmount = remainingBalance.sub(nextSubTry);
//         const amountToSend = targetAmount.gt(0) ? targetAmount : bn(1);

//         const txResponse = await fromWallet.transfer(
//           toWallet.address,
//           amountToSend
//         );
//         await txResponse.waitForResult();
//         console.log(
//           `asd Success sending ${amountToSend?.format()} back to ${toWallet.address.toB256()}`
//         );
//       }
//     } catch (e) {
//       console.log('error sending remaining balance', e.message);
//       await trySendMax(attempt + 1);
//     }
//   };

//   await trySendMax();
// };

export const transferMaxBalance = async ({
  fromWallet,
  toWallet,
}: {
  fromWallet: WalletUnlocked;
  toWallet: WalletUnlocked;
}) => {
  if (!fromWallet || !toWallet) {
    return;
  }
  const provider = fromWallet.provider;

  const {
    consensusParameters: {
      txParameters: { maxInputs },
    },
  } = await provider.getChain();

  const baseAssetId = await provider.getBaseAssetId();
  const { coins } = await fromWallet.getCoins(baseAssetId);

  if (coins.length > Number(maxInputs.toString())) {
    throw new Error('Impossible to determine maximum spendable amount');
  }

  const request = new ScriptTransactionRequest();

  request.addResources(coins);

  await request.estimateAndFund(fromWallet);

  const changeOutput = request.outputs.find(
    (output) =>
      output.type === OutputType.Change && output.assetId === baseAssetId
  ) as ChangeTransactionRequestOutput;

  changeOutput.to = toWallet.address.toB256();

  const tx = await fromWallet.sendTransaction(request, {
    estimateTxDependencies: false,
  });
  await tx.waitForResult();
};
