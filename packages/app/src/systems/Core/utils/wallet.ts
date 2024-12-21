import type {
  EstimateTransactionParams,
  TransactionRequest,
  TransactionRequestLike,
  TransactionResponse,
  // SendTransactionParams, This should come from fuels
} from 'fuels';
import { WalletLocked, hashMessage, transactionRequestify } from 'fuels';
import { VaultService } from '~/systems/Vault';

interface SendTransactionParams {
  skipCustomFee?: boolean;
  onBeforeSend?: (txRequest: TransactionRequest) => Promise<TransactionRequest>;
}

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
    transactionRequestLike: TransactionRequestLike,
    params?: EstimateTransactionParams & SendTransactionParams
  ): Promise<TransactionResponse> {
    let transactionRequest = transactionRequestify(transactionRequestLike);

    // Apply onBeforeSend hook if provided
    if (params?.onBeforeSend) {
      transactionRequest = await params.onBeforeSend(transactionRequest);
    }

    const txRequestToSend =
      await this.populateTransactionWitnessesSignature(transactionRequest);

    await this.simulateTransaction(txRequestToSend, {
      estimateTxDependencies: params?.estimateTxDependencies ?? false,
    });
    return this.provider.sendTransaction(txRequestToSend, {
      estimateTxDependencies: params?.estimateTxDependencies ?? false,
    });
  }
}
