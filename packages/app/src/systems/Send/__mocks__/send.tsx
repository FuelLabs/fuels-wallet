/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { WalletUnlocked } from 'fuels';
import { createMockAccount } from '~/systems/Account';
import { getMockedTransaction } from '~/systems/DApp/__mocks__/dapp-transaction';
import { NetworkService } from '~/systems/Network';

export function sendLoader(wallet: WalletUnlocked) {
  return async () => {
    const { account: acc1 } = await createMockAccount();
    await NetworkService.clearNetworks();
    const network = await NetworkService.addDefaultNetworks();
    const transactionRequest = await getMockedTransaction(
      acc1?.publicKey || '',
      wallet.publicKey,
      network?.url!
    );
    return { acc1, network, transactionRequest, address: acc1?.address };
  };
}
