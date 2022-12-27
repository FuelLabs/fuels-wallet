/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { WalletUnlocked } from 'fuels';
import { useEffect } from 'react';

import { createMockAccount } from '~/systems/Account';
import { useTransactionRequest } from '~/systems/DApp';
import { getMockedTransaction } from '~/systems/DApp/__mocks__/dapp-transaction';
import { NetworkService } from '~/systems/Network';

export function sendLoader(wallet: WalletUnlocked) {
  return async () => {
    const { account: acc1 } = await createMockAccount();
    await NetworkService.clearNetworks();
    const network = await NetworkService.addFirstNetwork();
    const transactionRequest = await getMockedTransaction(
      acc1?.publicKey || '',
      wallet.publicKey,
      network?.url!
    );
    return { acc1, network, transactionRequest };
  };
}

export function useTxRequestMock(loaded: any) {
  const { transactionRequest, network } = loaded || {};
  const txRequest = useTransactionRequest();

  useEffect(() => {
    txRequest.handlers.request({
      transactionRequest,
      providerUrl: network?.url,
    });
  }, []);

  return txRequest;
}
