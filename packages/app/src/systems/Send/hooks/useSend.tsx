import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BigNumberish } from 'fuels';
import { bn, isBech32 } from 'fuels';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAccounts } from '~/systems/Account';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionRequestMachine';
import type { TxInputs } from '~/systems/Transaction/services';

import { useWallet } from '@fuels/react';
import { sendMachine } from '../machines/sendMachine';
import type { SendMachineState } from '../machines/sendMachine';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  loadingTx = 'loadingTx',
}

export type PresetFeeType = 'regular' | 'fast';
export type FeeType = PresetFeeType | 'advanced';

const selectors = {
  maxFee(state: SendMachineState) {
    return state.context.maxFee;
  },
  regularTip(state: SendMachineState) {
    return state.context.regularTip;
  },
  fastTip(state: SendMachineState) {
    return state.context.fastTip;
  },
  currentFeeType(state: SendMachineState) {
    return state.context.currentFeeType;
  },
  readyToSend(state: SendMachineState) {
    return state.matches('readyToSend');
  },
  error(state: SendMachineState) {
    return state.context.error;
  },
  status(txStatus?: TxRequestStatus) {
    return useCallback(
      (state: SendMachineState) => {
        const isLoadingTx =
          state.matches('creatingTx') ||
          txStatus === TxRequestStatus.loading ||
          txStatus === TxRequestStatus.sending;
        if (isLoadingTx) return SendStatus.loadingTx;
        return SendStatus.selecting;
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
        } catch (_error) {
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
        callTransactionRequest(ctx) {
          const { providerUrl, transactionRequest, address } = ctx;
          if (!providerUrl || !transactionRequest || !address) {
            throw new Error('Params are required');
          }

          txRequest.handlers.request({
            providerUrl,
            transactionRequest,
            address,
          });
        },
      },
    })
  );

  const amount = form.watch('amount');
  const errorMessage = useSelector(service, selectors.error);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (bn(amount).gt(0) && form.formState.isValid) {
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
      service.send('SET_DATA', { input });
    }
  }, [amount, form.formState.isValid]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (errorMessage) {
      form.setError('amount', {
        type: 'pattern',
        message: errorMessage.split(':')[0],
      });
    }
  }, [errorMessage]);

  const maxFee = useSelector(service, selectors.maxFee);
  const regularTip = useSelector(service, selectors.regularTip);
  const fastTip = useSelector(service, selectors.fastTip);
  const currentFeeType = useSelector(service, selectors.currentFeeType);
  const sendStatusSelector = selectors.status(txRequest.txStatus);
  const sendStatus = useSelector(service, sendStatusSelector);
  const readyToSend = useSelector(service, selectors.readyToSend);

  const { regularFee, fastFee } = useMemo(() => {
    if (!maxFee || !regularTip || !fastTip) return {};

    return {
      regularFee: maxFee.add(regularTip),
      fastFee: maxFee.add(fastTip),
    };
  }, [maxFee, regularTip, fastTip]);

  const balanceAssets = accountBalanceAssets?.filter(({ assetId }) =>
    assets.find((asset) => asset.assetId === assetId)
  );

  const assetIdSelected = form.getValues('asset');
  const balanceAssetSelected =
    bn(
      balanceAssets?.find(({ assetId }) => assetId === assetIdSelected)?.amount
    ) || bn(0);

  function status(status: keyof typeof SendStatus) {
    return sendStatus === status;
  }

  function cancel() {
    service.send('BACK');
  }
  function submit() {
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
    if (bn(balanceAssetSelected).lt(amount!)) {
      form.setError('amount', {
        type: 'pattern',
        message: 'Insufficient funds',
      });
      return;
    }
    form.clearErrors('amount');
    form.trigger('amount');
  }

  function changeCurrentFeeType(type: FeeType) {
    const eventName =
      type === 'regular'
        ? 'USE_REGULAR_FEE'
        : type === 'fast'
          ? 'USE_FAST_FEE'
          : 'USE_ADVANCED_FEE';
    service.send(eventName);
  }

  return {
    form,
    maxFee,
    regularTip,
    fastTip,
    regularFee,
    fastFee,
    currentFeeType,
    status,
    readyToSend,
    balanceAssets,
    account,
    txRequest,
    assetIdSelected,
    balanceAssetSelected,
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
      handleValidateAmount,
      changeCurrentFeeType,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
