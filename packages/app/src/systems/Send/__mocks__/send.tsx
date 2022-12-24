/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Address } from 'fuels';
import { useEffect } from 'react';

import { createMockAccount } from '~/systems/Account';
import { useTransactionRequest } from '~/systems/DApp';
import { getMockedTransaction } from '~/systems/DApp/__mocks__/dapp-transaction';
import { NetworkService } from '~/systems/Network';

export async function sendLoader() {
  const { account: acc1, manager } = await createMockAccount();
  await NetworkService.clearNetworks();
  const network = await NetworkService.addFirstNetwork();
  const wallet = manager.getWallet(Address.fromAddressOrString(acc1?.address!));
  const transactionRequest = await getMockedTransaction(
    wallet.publicKey || '',
    '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
    network?.url!
  );
  return { acc1, network, transactionRequest };
}

export function useTxRequestMock({
  loaded: { transactionRequest, network },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  const txRequest = useTransactionRequest();

  useEffect(() => {
    txRequest.handlers.request({
      transactionRequest,
      providerUrl: network.url,
    });
  }, []);

  return txRequest;
}
