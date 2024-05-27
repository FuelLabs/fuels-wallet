import { Signer } from 'fuels';
import { createMockAccount } from '~/systems/Account';
import { getMockedTransaction } from '~/systems/DApp/__mocks__/dapp-transaction';
import { NetworkService } from '~/systems/Network';

export function sendLoader() {
  return async () => {
    const signer = new Signer(Signer.generatePrivateKey());
    const { account: acc1 } = await createMockAccount();
    await NetworkService.clearNetworks();
    const network = await NetworkService.addDefaultNetworks();
    const transactionRequest = await getMockedTransaction(
      signer.publicKey,
      network?.url!
    );

    return {
      acc1,
      network,
      transactionRequest,
      address: acc1?.address,
      receiver: signer.address,
    };
  };
}
