import type {
  AbstractAddress,
  TransactionRequestLike,
  TransactionResponse,
} from 'fuels';
import { WalletLocked } from 'fuels';

import type { FuelWalletConnector } from './FuelWalletConnector';
import type { FuelWalletProvider } from './FuelWalletProvider';

export class FuelWalletLocked extends WalletLocked {
  connector: FuelWalletConnector;
  _provider: FuelWalletProvider;

  constructor(
    address: string | AbstractAddress,
    connector: FuelWalletConnector,
    provider: FuelWalletProvider
  ) {
    super(address, provider);
    this.connector = connector;
    this._provider = provider;
  }

  async signMessage(message: string): Promise<string> {
    return this.connector.signMessage(this.address.toString(), message);
  }

  async sendTransaction(
    transaction: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const transactionId = await this.connector.sendTransaction(
      this.address.toString(),
      transaction
    );
    return this.provider.getTransactionResponse(transactionId);
  }

  get provider(): FuelWalletProvider {
    return this._provider;
  }
}
