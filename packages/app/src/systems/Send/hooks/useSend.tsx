import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BigNumberish } from 'fuels';
import { bn, isBech32 } from 'fuels';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import type { SendMachineState } from '../machines/sendMachine';
import { sendMachine } from '../machines/sendMachine';

import { useAccounts } from '~/systems/Account';
import { isEth, useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionMachine';
import type { TxInputs } from '~/systems/Transaction/services';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  loadingTx = 'loadingTx',
  confirming = 'confirming',
}

const selectors = {
  fee(state: SendMachineState) {
    return state.context.fee;
  },
  isInvalid(state: SendMachineState) {
    return state.matches('invalid');
  },
  status(txStatus?: TxRequestStatus) {
    return useCallback(
      (state: SendMachineState) => {
        const isLoadingTx =
          state.matches('creatingTx') ||
          txStatus === TxRequestStatus.loading ||
          txStatus === TxRequestStatus.sending;

        if (state.matches('fetchingFakeTx')) return SendStatus.loading;
        if (isLoadingTx) return SendStatus.loadingTx;
        if (state.matches('confirming')) return SendStatus.confirming;
        return SendStatus.selecting;
      },
      [txStatus]
    );
  },
  title(txStatus?: TxRequestStatus) {
    return useCallback(
      (state: SendMachineState) => {
        if (txStatus === TxRequestStatus.success) return 'Transaction sent';
        if (txStatus === TxRequestStatus.failed) return 'Transaction failed';
        if (txStatus === TxRequestStatus.sending) return 'Sending transaction';
        if (state.matches('creatingTx')) return 'Creating transaction';
        if (state.matches('confirming')) return 'Approve Transaction';
        if (state.matches('invalid')) return 'Invalid transaction';
        return 'Send';
      },
      [txStatus]
    );
  },
};

const schema = yup
  .object({
    asset: yup.string().required('Asset is required'),
    amount: yup.string().required('Amount is required'),
    address: yup
      .string()
      .required('Address is required')
      .test('is-address', 'Invalid bech32 address', (value) => {
        try {
          return Boolean(value && isBech32(value));
        } catch (error) {
          return false;
        }
      }),
  })
  .required();

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account, balanceAssets: accountBalanceAssets } = useAccounts();
  const { assets } = useAssets();

  const form = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      asset: '',
      amount: '',
      address: '',
    },
  });

  const service = useInterpret(() =>
    sendMachine.withConfig({
      actions: {
        goToHome() {
          navigate(Pages.index());
        },
        callTransactionRequest(_, ev) {
          txRequest.handlers.request(ev.data);
        },
      },
    })
  );

  const fee = useSelector(service, selectors.fee);
  const sendStatusSelector = selectors.status(txRequest.txStatus);
  const sendStatus = useSelector(service, sendStatusSelector);
  const isInvalid = useSelector(service, selectors.isInvalid);
  const titleSelector = selectors.title(txRequest.txStatus);
  const title = useSelector(service, titleSelector);

  const balanceAssets = accountBalanceAssets?.filter(({ assetId }) =>
    assets.find((asset) => asset.assetId === assetId)
  );

  const assetIdSelected = form.getValues('asset');
  const balanceAssetSelected = balanceAssets?.find(
    ({ assetId }) => assetId === assetIdSelected
  );
  const isEthSelected =
    !!assetIdSelected && isEth({ assetId: assetIdSelected });
  const maxAmountToSend = bn(balanceAssetSelected?.amount).sub(
    isEthSelected ? bn(fee) : 0
  );

  function status(status: keyof typeof SendStatus) {
    return sendStatus === status;
  }

  function cancel() {
    if (txRequest.status('success')) {
      navigate(Pages.index());
      return;
    }
    txRequest.handlers.reset();
    service.send('BACK');
  }
  function submit() {
    if (txRequest.status('idle')) {
      const asset = assets.find(
        ({ assetId }) => assetId === form.getValues('asset')
      );
      const amount = bn(form.getValues('amount'));
      const address = form.getValues('address');
      const input = {
        account,
        asset,
        amount,
        address,
      } as TxInputs['isValidTransaction'];
      service.send('CONFIRM', { input });
    } else {
      txRequest.handlers.approve();
    }
  }
  function goHome() {
    navigate(Pages.index());
  }
  function tryAgain() {
    txRequest.handlers.tryAgain();
  }

  function handleValidateAmount(amount?: BigNumberish) {
    if (bn(amount).lte(0)) {
      form.setError('amount', {
        type: 'pattern',
        message: 'Amount is required',
      });
      return;
    }
    if (maxAmountToSend.lt(amount!)) {
      form.setError('amount', {
        type: 'pattern',
        message: 'Insufficient funds',
      });
      return;
    }
    form.clearErrors('amount');
    form.trigger('amount');
  }

  return {
    form,
    fee,
    title,
    status,
    isInvalid,
    balanceAssets,
    account,
    txRequest,
    assetIdSelected,
    maxAmountToSend,
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
      handleValidateAmount,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
