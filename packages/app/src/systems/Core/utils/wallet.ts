import type {
  HashableMessage,
  TransactionRequestLike,
  TransactionResponse,
} from 'fuels';
import { WalletLocked, transactionRequestify } from 'fuels';
import { VaultService } from '~/systems/Vault';

export class WalletLockedCustom extends WalletLocked {
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
