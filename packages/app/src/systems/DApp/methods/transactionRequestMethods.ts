import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import { transactionRequestify } from 'fuels';
import { useEffect } from 'react';

import type { TransactionMachineService } from '../machines/transactionMachine';

import { IS_CRX_POPUP } from '~/config';
import type { MessageInputs } from '~/systems/CRX/background/services/types';
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

  async sendTransaction(input: MessageInputs['sendTransaction']) {
    const { origin, address, provider, transaction } = input;
    const providerUrl = provider.url;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    this.service.send('START_REQUEST', {
      input: { origin, transactionRequest, address, providerUrl },
    });
    const state = await waitForState(this.service, 'txSuccess');
    return state.response?.approvedTx?.id;
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
