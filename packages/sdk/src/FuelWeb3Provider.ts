import type { TransactionRequestLike } from 'fuels';
import { transactionRequestify, TransactionResponse, Provider } from 'fuels';

import type { FuelWeb3SDK } from './FuelWeb3SDK';

export class FuelWeb3Provider extends Provider {
  fuelWeb3: FuelWeb3SDK;

  constructor(fuelWeb3: FuelWeb3SDK) {
    super(fuelWeb3.providerConfig.url);
    this.fuelWeb3 = fuelWeb3;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const transactionId = await this.fuelWeb3.sendTransaction(
      transactionRequestLike
    );
    const transactionRequest = transactionRequestify(transactionRequestLike);
    const response = new TransactionResponse(
      transactionId,
      transactionRequest,
      this
    );
    return response;
  }
}
