import type { TransactionRequestLike } from 'fuels';
import { TransactionResponse, Provider } from 'fuels';

import type { FuelWalletConnection } from './FuelWalletConnection';

export class FuelWalletProvider extends Provider {
  walletConnection: FuelWalletConnection;

  constructor(walletConnection: FuelWalletConnection) {
    super(walletConnection.providerConfig.url);
    this.walletConnection = walletConnection;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const transactionId = await this.walletConnection.sendTransaction(
      transactionRequestLike
    );
    const response = new TransactionResponse(transactionId, this);
    return response;
  }
}
