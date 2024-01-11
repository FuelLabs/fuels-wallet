import type {
  AbstractAddress,
  TransactionRequestLike,
  TransactionResponse,
} from 'fuels';
import { WalletLocked } from 'fuels';

import type { FuelWalletProvider } from './FuelWalletProvider';

export class FuelWalletLocked extends WalletLocked {
  provider: FuelWalletProvider;

  constructor(address: string | AbstractAddress, provider: FuelWalletProvider) {
    super(address, provider);
    this.provider = provider;
  }

  async signMessage(message: string): Promise<string> {
    return this.provider.walletConnection.signMessage(
      this.address.toString(),
      message
    );
  }

  async sendTransaction(
    transaction: TransactionRequestLike
  ): Promise<TransactionResponse> {
    return this.provider.sendTransaction({
      ...transaction,
      signer: this.address.toString(),
    });
  }
}
