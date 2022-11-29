import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useEffect, useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { INVALID_TX_ID_ERROR, transactionMachine } from '../machines';
import type { TxInputs } from '../services';
import { getCoinInputsFromTx, getCoinOutputsFromTx } from '../utils';

const selectors = {
  isLoading: (state: TransactionMachineState) => state.matches('fetching'),
  txResponse: (state: TransactionMachineState) => state.context?.txResponse,
  isInvalidTxId: (state: TransactionMachineState) =>
    state.context?.error === INVALID_TX_ID_ERROR,
  txStatus: (state: TransactionMachineState) => state.context?.txStatus,
  tx: (state: TransactionMachineState) => state.context?.tx,
  txResult: (state: TransactionMachineState) => state.context?.txResult,
  fee: (state: TransactionMachineState) => state.context?.fee,
};

export function useTransaction(txId: string = '') {
  const service = useInterpret(() => transactionMachine);
  const { send } = service;
  const isLoading = useSelector(service, selectors.isLoading);
  const txResponse = useSelector(service, selectors.txResponse);
  const isInvalidTxId = useSelector(service, selectors.isInvalidTxId);
  const txStatus = useSelector(service, selectors.txStatus);
  const tx = useSelector(service, selectors.tx);
  const txResult = useSelector(service, selectors.txResult);
  const fee = useSelector(service, selectors.fee);

  const { coinInputs, coinOutputs, outputsToSend, outputAmount } =
    useMemo(() => {
      if (!tx)
        return { coinOutputs: [], outputsToSend: [], outputAmount: bn(0) };

      const coinInputs = getCoinInputsFromTx(tx);
      const coinOutputs = getCoinOutputsFromTx(tx);
      const inputPublicKey = coinInputs[0]?.owner;
      const outputsToSend = coinOutputs.filter(
        (value) => value.to !== inputPublicKey
      );
      const outputAmount = outputsToSend.reduce(
        (acc, value) => acc.add(value.amount),
        bn(0)
      );

      return { coinInputs, coinOutputs, outputsToSend, outputAmount };
    }, [tx]);

  function getTransaction(input: TxInputs['fetch']) {
    // TODO: remove providerUrl before finishing. this one is for testing
    send('GET_TRANSACTION', {
      input: {
        ...input,
        providerUrl: 'https://node-beta-2.fuel.network/graphql',
      },
    });
  }

  useEffect(() => {
    if (txId) {
      getTransaction({ txId });
    }
  }, [txId]);

  return {
    handlers: {
      getTransaction,
    },
    isLoading,
    txResponse,
    isInvalidTxId,
    txStatus,
    tx,
    txResult,
    coinInputs,
    coinOutputs,
    outputsToSend,
    outputAmount,
    fee,
  };
}
