import { ExtensionPageConnection } from '@fuels-wallet/sdk';
import { transactionRequestify } from 'fuels';
import { useEffect } from 'react';

import type { TransactionMachineService } from '../machines';

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
    transaction,
  }: {
    origin: string;
    transaction: string;
  }) {
    const providerUrl = 'http://localhost:4000/graphql';
    const tx = transactionRequestify(JSON.parse(transaction));
    this.service.send('START_REQUEST', {
      input: { origin, tx, providerUrl },
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
