import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BN, BNInput } from 'fuels';
import { bn, isBech32 } from 'fuels';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

const selectors = {
  minGasLimit(state: SendMachineState) {
    return state.context.minGasLimit;
  },
  maxGasLimit(state: SendMachineState) {
    return state.context.maxGasLimit;
  },
  baseFee(state: SendMachineState) {
    return state.context.baseFee;
  },
  regularTip(state: SendMachineState) {
    return state.context.regularTip;
  },
  fastTip(state: SendMachineState) {
    return state.context.fastTip;
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
          state.matches('changingInput') ||
          txStatus === TxRequestStatus.loading ||
          txStatus === TxRequestStatus.sending;
        if (isLoadingTx) return SendStatus.loadingTx;
        return SendStatus.selecting;
      },
      [txStatus]
    );
  },
};

type BalanceAsset = {
  assetId: string;
  amount?: BNInput;
};

type SchemaOptions = {
  accountBalanceAssets: BalanceAsset[];
  baseFee: BN | undefined;
  maxGasLimit: BN | undefined;
};

const schema = yup
  .object({
    asset: yup.string().required('Asset is required'),
    amount: yup
      .mixed<BN>()
      .test('positive', 'Amount must be greater than 0', (value) => {
        return value?.gt(0);
      })
      .test('balance', 'Insufficient funds', (value, ctx) => {
        const { asset, fees } = ctx.parent as SendFormValues;
        const { accountBalanceAssets, baseFee } = ctx.options
          .context as SchemaOptions;

        const balanceAssetSelected = accountBalanceAssets?.find(
          ({ assetId }) => assetId === asset
        );
        if (!balanceAssetSelected?.amount || !value) {
          return false;
        }

        if (value.gt(balanceAssetSelected.amount)) {
          return false;
        }

        // It means "baseFee" is being calculated
        if (!baseFee) {
          return true;
        }

        const totalAmount = value.add(baseFee.add(fees.tip.amount));
        return totalAmount.lte(bn(balanceAssetSelected.amount));
      })
      .required('Amount is required'),
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
        tip: yup.object({
          amount: yup
            .mixed<BN>()
            .test(
              'integer',
              'Tip must be greater than or equal to 0',
              (value) => {
                return value?.gte(0);
              }
            )
            .required('Tip is required'),
          text: yup.string().required('Tip is required'),
        }),
        gasLimit: yup.object({
          amount: yup
            .mixed<BN>()
            .test(
              'integer',
              'Gas limit must be greater or equal to 0',
              (value) => {
                return value?.gte(0);
              }
            )
            .test({
              name: 'max',
              test: (value, ctx) => {
                const { maxGasLimit } = ctx.options.context as SchemaOptions;
                if (!maxGasLimit) return false;

                if (value?.lte(maxGasLimit)) {
                  return true;
                }

                return ctx.createError({
                  message: `Gas limit '${value?.toString()}' is greater than the allowed: '${maxGasLimit.toString()}'.`,
                });
              },
            })
            .required('Gas limit is required'),
          text: yup.string().required('Gas limit is required'),
        }),
      })
      .required('Fees are required'),
  })
  .required();

export type SendFormValues = {
  asset: string;
  address: string;
  amount: BN;
  fees: {
    tip: {
      amount: BN;
      text: string;
    };
    gasLimit: {
      amount: BN;
      text: string;
    };
  };
};

const DEFAULT_VALUES: SendFormValues = {
  asset: '',
  amount: bn(0),
  address: 'fuel1szcrxk7ee258shhlw4a4tycqz8xl32ra0ukcddh58txluunlpjfqnl5mhv',
  fees: {
    tip: {
      amount: bn(0),
      text: '0',
    },
    gasLimit: {
      amount: bn(0),
      text: '0',
    },
  },
};

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account, balanceAssets: accountBalanceAssets } = useAccounts();
  const { assets } = useAssets();

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

  const baseFee = useSelector(service, selectors.baseFee);
  const minGasLimit = useSelector(service, selectors.minGasLimit);
  const maxGasLimit = useSelector(service, selectors.maxGasLimit);
  const errorMessage = useSelector(service, selectors.error);

  const form = useForm<SendFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
    context: {
      accountBalanceAssets,
      baseFee,
      maxGasLimit,
    },
  });

  const tip = useWatch({
    control: form.control,
    name: 'fees.tip.amount',
  });

  const gasLimit = useWatch({
    control: form.control,
    name: 'fees.gasLimit.amount',
  });

  const { isValid } = form.formState;

  const amount = useWatch({
    control: form.control,
    name: 'amount',
  });
  const address = useWatch({
    control: form.control,
    name: 'address',
  });
  const assetIdSelected = useWatch({
    control: form.control,
    name: 'asset',
  });

  const regularTip = useSelector(service, selectors.regularTip);
  const fastTip = useSelector(service, selectors.fastTip);
  const sendStatusSelector = selectors.status(txRequest.txStatus);
  const sendStatus = useSelector(service, sendStatusSelector);
  const readyToSend = useSelector(service, selectors.readyToSend);

  const balanceAssets = useMemo(() => {
    return accountBalanceAssets?.filter(({ assetId }) =>
      assets.find((asset) => asset.assetId === assetId)
    );
  }, [assets, accountBalanceAssets]);

  const balanceAssetSelected = useMemo<BN>(() => {
    const asset = balanceAssets?.find(
      ({ assetId }) => assetId === assetIdSelected
    );
    if (!asset) return bn(0);

    return bn(asset.amount);
  }, [balanceAssets, assetIdSelected]);

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

  useEffect(() => {
    if (isValid && address && assetIdSelected) {
      const input: TxInputs['createTransfer'] = {
        to: address,
        assetId: assetIdSelected,
        amount,
        tip,
        gasLimit,
      };

      service.send('SET_INPUT', { input });
    }
  }, [isValid, service.send, address, assetIdSelected, amount, tip, gasLimit]);

  return {
    form,
    baseFee,
    minGasLimit,
    tip,
    regularTip,
    fastTip,
    status,
    readyToSend,
    balanceAssets,
    account,
    txRequest,
    assetIdSelected,
    balanceAssetSelected,
    errorMessage,
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
