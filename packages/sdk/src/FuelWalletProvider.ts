import type { ProviderOptions, TransactionRequestLike } from 'fuels';
import { TransactionResponse, Provider } from 'fuels';

import type { FuelWalletConnection } from './FuelWalletConnection';

type FuelWalletProviderOptions = ProviderOptions & {
  walletConnection: FuelWalletConnection;
};

export class FuelWalletProvider extends Provider {
  walletConnection: FuelWalletConnection;

  constructor(url: string, options: FuelWalletProviderOptions) {
    super(url, options);
    this.walletConnection = options.walletConnection;
  }

  static async create(
    url: string,
    options: FuelWalletProviderOptions,
  ): Promise<FuelWalletProvider> {
    const provider = new FuelWalletProvider(url, options);
    await provider.fetchChainAndNodeInfo();
    return provider;
  }

  async sendTransaction(
    transactionRequestLike: TransactionRequestLike & { signer?: string },
  ): Promise<TransactionResponse> {
    const transactionId = await this.walletConnection.sendTransaction(
      transactionRequestLike,
      { url: this.url },
    );
    const response = new TransactionResponse(transactionId, this);
    return response;
  }
}
