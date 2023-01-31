import type { TransactionRequestLike } from 'fuels';
import { TransactionResponse, Provider } from 'fuels';

import type { FuelWalletConnection } from './FuelWalletConnection';

export class FuelWalletProvider extends Provider {
  walletConnection: FuelWalletConnection;

  constructor(providerUrl: string, walletConnection: FuelWalletConnection) {
    super(providerUrl);
    this.walletConnection = walletConnection;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike & { signer?: string }
  ): Promise<TransactionResponse> {
    const transactionId = await this.walletConnection.sendTransaction(
      transactionRequestLike,
      { url: this.url }
    );
    const response = new TransactionResponse(transactionId, this);
    return response;
  }
}
