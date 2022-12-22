import type { TransactionRequestLike } from 'fuels';
import { TransactionResponse, Provider } from 'fuels';

import type { FuelWeb3SDK } from './FuelWeb3SDK';

export class FuelWeb3Provider extends Provider {
  fuelWeb3: FuelWeb3SDK;

  constructor(providerUrl: string, fuelWeb3: FuelWeb3SDK) {
    super(providerUrl);
    this.fuelWeb3 = fuelWeb3;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const transactionId = await this.fuelWeb3.sendTransaction(
      this.url,
      transactionRequestLike
    );
    return new TransactionResponse(transactionId, this);
  }
}
