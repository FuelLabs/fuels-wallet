import type { TransactionRequestLike } from 'fuels';
import { transactionRequestify, TransactionResponse, Provider } from 'fuels';

import type { FuelWeb3 } from './FuelWeb3';

export class FuelWeb3Provider extends Provider {
  fuelWeb3: FuelWeb3;

  constructor(fuelWeb3: FuelWeb3) {
    super('http://localhost:4000/graphql');
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
      new Provider('http://localhost:4000/graphql')
    );
    return response;
  }
}
