import type {
  AbstractAddress,
  TransactionRequestLike,
  TransactionResponse,
} from 'fuels';
import { WalletLocked } from 'fuels';

import type { FuelWalletConnector } from './FuelWalletConnector';
import type { FuelWalletProvider } from './FuelWalletProvider';
import type { Network } from './types';

export class FuelWalletLocked extends WalletLocked {
  connector: FuelWalletConnector;
  provider: FuelWalletProvider;

  constructor(
    address: string | AbstractAddress,
    connector: FuelWalletConnector,
    provider: FuelWalletProvider
  ) {
    super(address, provider);
    this.connector = connector;
    this.provider = provider;
  }

  /**
   * Return the network respective to the provider url and chainId of the
   * wallet instance.
   *
   * If the network is not found on the connector, throws an error to indicate
   * that the network must be added to the connector.
   */
  async getNetwork(): Promise<Network> {
    const chainId = this.provider.getChainId();
    const networks = await this.connector.networks();
    const network = networks.find((n) => {
      n.url === this.provider.url && n.chainId === chainId;
    });
    if (!network) {
      throw new Error(
        'Network not found on the connector. See `addNetwork`, `selectNetwork` methods.'
      );
    }
    return network;
  }

  async signMessage(message: string): Promise<string> {
    return this.connector.signMessage(this.address.toString(), message);
  }

  async sendTransaction(
    transaction: TransactionRequestLike
  ): Promise<TransactionResponse> {
    const network = await this.getNetwork();
    const transactionId = await this.connector.sendTransaction(
      this.address.toString(),
      transaction,
      network
    );
    return this.provider.getTransactionResponse(transactionId);
  }
}
