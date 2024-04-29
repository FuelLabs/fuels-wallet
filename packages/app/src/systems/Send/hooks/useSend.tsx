import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BigNumberish } from 'fuels';
import { bn, isBech32 } from 'fuels';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAccounts } from '~/systems/Account';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionRequestMachine';
import type { TxInputs } from '~/systems/Transaction/services';

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
  regularFee(state: SendMachineState) {
    const { maxFee, regularTip } = state.context;
    if (!maxFee || !regularTip) return undefined;
    return maxFee.add(regularTip);
  },
  fastFee(state: SendMachineState) {
    const { maxFee, fastTip } = state.context;
    if (!maxFee || !fastTip) return undefined;
    return maxFee.add(fastTip);
  },
  currentFeeType(state: SendMachineState) {
    return state.context.currentFeeType;
  },
  currentFee(state: SendMachineState) {
    const { maxFee, currentFeeType } = state.context;
    const regularFee = selectors.regularFee(state);
    const fastFee = selectors.fastFee(state);

    if (!maxFee || !regularFee || !fastFee) return undefined;

    if (currentFeeType === 'regular') return regularFee;
    if (currentFeeType === 'fast') return fastFee;
    // @TODO: add custom return here
  },
  baseAssetId(state: SendMachineState) {
    return state.context.baseAssetId;
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
    fees: yup
      .object({
        tip: yup.string().required('Tip is required'),
        gasLimit: yup.string().required('Gas limit is required'),
      })
      .required('Fees are required'),
  })
  .required();

export type SendFormValues = {
  asset: string;
  amount: string;
  address: string;
  fees: {
    tip: string;
    gasLimit: string;
  };
};

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account, balanceAssets: accountBalanceAssets } = useAccounts();
  const { assets } = useAssets();

  const form = useForm<SendFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      asset: '',
      amount: '',
      // @TODO: Revert it
      address:
        'fuel1nxwnn86y8hhg4nklx53kr3c24kxaqp6txmyrp9nkrs6p6s82ykxsnj82x5',
      // @TODO: Should it be a string?
      fees: {
        tip: '1.5',
        gasLimit: '21000',
      },
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
  const address = form.watch('address');
  const asset = form.watch('asset');
  const errorMessage = useSelector(service, selectors.error);

  const baseAssetId = useSelector(service, selectors.baseAssetId);
  const maxFee = useSelector(service, selectors.maxFee);
  const regularTip = useSelector(service, selectors.regularTip);
  const fastTip = useSelector(service, selectors.fastTip);
  const fastFee = useSelector(service, selectors.fastFee);
  const regularFee = useSelector(service, selectors.regularFee);
  const currentFee = useSelector(service, selectors.currentFee);
  const currentFeeType = useSelector(service, selectors.currentFeeType);
  const sendStatusSelector = selectors.status(txRequest.txStatus);
  const sendStatus = useSelector(service, sendStatusSelector);
  const readyToSend = useSelector(service, selectors.readyToSend);

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
    service.send('CONFIRM');
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
    const totalAmount = bn(amount).add(bn(currentFee));
    if (bn(balanceAssetSelected).lt(totalAmount)) {
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const bnAmount = bn(amount);
    const totalAmount = bnAmount.add(bn(currentFee));
    const isAmountValid =
      !bn(amount).lte(0) && !bn(balanceAssetSelected).lt(totalAmount);
    if (
      isAmountValid &&
      address &&
      asset &&
      bnAmount.gt(0) &&
      form.formState.isValid
    ) {
      const hasAsset = !!assets.find(({ assetId }) => assetId === asset);
      if (!hasAsset) return;

      const input = {
        to: address,
        assetId: asset,
        amount: bnAmount,
      } as TxInputs['createTransfer'];
      service.send('SET_DATA', { input });
    }
  }, [amount, address, asset, currentFee?.toString(), form.formState.isValid]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (errorMessage) {
      form.setError('amount', {
        type: 'pattern',
        message: errorMessage.split(':')[0],
      });
    }
  }, [errorMessage]);

  return {
    form,
    maxFee,
    regularTip,
    fastTip,
    regularFee,
    fastFee,
    currentFee,
    currentFeeType,
    status,
    readyToSend,
    balanceAssets,
    account,
    txRequest,
    assetIdSelected,
    balanceAssetSelected,
    baseAssetId,
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
