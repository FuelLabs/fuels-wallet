import type { TransactionRequestLike, TransactionResponse } from 'fuels';
import { WalletLocked, hashMessage, transactionRequestify } from 'fuels';
import { VaultService } from '~/systems/Vault';

export class WalletLockedCustom extends WalletLocked {
  // @TODO: remove this workaround asap, because it's a security issue
  // fuels is not keeping the url correct in this.provider.url so we need to override
  providerUrl = '';
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
      providerUrl: this.providerUrl,
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
    await this.provider.estimateTxDependencies(transactionRequest);
    const txRequestToSend =
      await this.populateTransactionWitnessesSignature(transactionRequest);
    return this.provider.sendTransaction(txRequestToSend);
  }
}
