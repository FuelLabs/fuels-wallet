import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import type { FuelProviderConfig } from '@fuel-wallet/types';
import { transactionRequestify } from 'fuels';
import { useEffect } from 'react';

import type { TransactionMachineService } from '../machines/transactionMachine';

import { IS_CRX_POPUP } from '~/config';
import { waitForState } from '~/systems/Core';

export class TransactionRequestMethods extends ExtensionPageConnection {
  readonly service: TransactionMachineService;

  constructor(service: TransactionMachineService) {
    super();
    this.service = service;
    super.externalMethods([this.sendTransaction]);
  }

  static start(service: TransactionMachineService) {
    return new TransactionRequestMethods(service);
  }

  async sendTransaction({
    origin,
    provider,
    transaction,
  }: {
    origin: string;
    provider: FuelProviderConfig;
    transaction: string;
  }) {
    const providerUrl = provider.url;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    this.service.send('START_REQUEST', {
      input: { origin, transactionRequest, providerUrl },
    });
    const state = await waitForState(this.service);
    return state.approvedTx?.id;
  }
}

export function useTransactionRequestMethods(
  service: TransactionMachineService
) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      TransactionRequestMethods.start(service);
    }
  }, [service]);
}
