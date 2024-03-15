import type { ProviderOptions } from 'fuels';
import { TransactionResponse, Provider } from 'fuels';

/**
 * @todo: We should add getTransactionResponse to TS-SDK in this way
 * a provider becomes self contained enabling connectors to implement
 * their on providers for customized responses.
 *
 * With the change we can remove the entire FuelWalletProvider.
 */
export class FuelWalletProvider extends Provider {
  constructor(url: string, options?: ProviderOptions) {
    super(url, options);
  }

  static async create(
    url: string,
    options?: ProviderOptions | undefined
  ): Promise<FuelWalletProvider> {
    const provider = new FuelWalletProvider(url, options);
    await provider.fetchChainAndNodeInfo();
    return provider;
  }

  async getTransactionResponse(
    transactionId: string
  ): Promise<TransactionResponse> {
    return new TransactionResponse(transactionId, this);
  }
}
