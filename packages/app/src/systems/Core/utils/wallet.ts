import type { TransactionRequestLike, TransactionResponse } from 'fuels';
import {
  type BN,
  OutputType,
  type Provider,
  ScriptTransactionRequest,
  WalletLocked,
  bn,
  hashMessage,
  transactionRequestify,
} from 'fuels';
import { VaultService } from '~/systems/Vault';

export class WalletLockedCustom extends WalletLocked {
  /**
   * Sign message with wallet instance privateKey
   *
   * @param message - Message
   * @returns Promise<string> - Signature a ECDSA 64 bytes
   */
  async signMessage(message: string): Promise<string> {
    return VaultService.signMessage({
      message: hashMessage(message),
      address: this.address.toString(),
    });
  }

  async signTransaction(
    transactionRequest: TransactionRequestLike
  ): Promise<string> {
    const signature = await VaultService.signTransaction({
      transaction: JSON.stringify(transactionRequest),
      address: this.address.toString(),
      providerUrl: this.provider.url,
    });
    return signature;
  }

  async populateTransactionWitnessesSignature(
    transactionRequestLike: TransactionRequestLike
  ) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    const signedTransaction = await this.signTransaction(transactionRequest);

    transactionRequest.updateWitnessByOwner(this.address, signedTransaction);

    return transactionRequest;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    const txRequestToSend =
      await this.populateTransactionWitnessesSignature(transactionRequest);

    await this.simulateTransaction(txRequestToSend, {
      estimateTxDependencies: false,
    });
    return this.provider.sendTransaction(txRequestToSend, {
      estimateTxDependencies: false,
    });
  }
}

/**
 * Calculates the maximum spendable amount for a given account
 */
export async function calculateMaxSpendable(
  accountAddress: string,
  provider: Provider,
  assetId: string
): Promise<BN> {
  const fromWallet = new WalletLockedCustom(accountAddress, provider);

  const chainData = await provider.getChain();
  const maxInputs = chainData.consensusParameters.txParameters.maxInputs;
  const { coins } = await fromWallet.getCoins(assetId);

  if (coins.length === 0) {
    return bn(0);
  }

  if (coins.length > Number(maxInputs.toString())) {
    throw new Error('Too many UTXOs to determine maximum spendable amount');
  }

  const request = new ScriptTransactionRequest();
  request.addResources(coins);

  await request.estimateAndFund(fromWallet);

  const changeOutput = request.outputs.find(
    (output) => output.type === OutputType.Change && output.assetId === assetId
  );

  const totalAmount = coins.reduce((sum, coin) => sum.add(coin.amount), bn(0));
  return changeOutput && 'amount' in changeOutput
    ? totalAmount.sub(changeOutput.amount)
    : totalAmount;
}
