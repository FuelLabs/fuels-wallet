import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BN, BNInput } from 'fuels';
import { Address, type Provider, bn, isB256 } from 'fuels';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAccounts } from '~/systems/Account';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionRequestMachine';
import type { TxInputs } from '~/systems/Transaction/services';

import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { formatGasLimit } from '~/systems/Transaction';
import { sendMachine } from '../machines/sendMachine';
import type { SendMachineState } from '../machines/sendMachine';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  loadingTx = 'loadingTx',
}

const selectors = {
  gasLimit(state: SendMachineState) {
    return state.context.gasLimit;
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
    if (state.context.error?.includes('Gas limit')) {
      return '';
    }

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
  balances: BalanceAsset[];
  baseFee: BN | undefined;
  gasLimit: BN | undefined;
  maxGasLimit: BN | undefined;
};

const schemaFactory = (provider?: Provider) =>
  yup
    .object({
      asset: yup.string().required('Asset is required'),
      amount: yup
        .mixed<BN>()
        .test('positive', 'Amount must be greater than 0', (value) => {
          return value?.gt(0);
        })
        .test('balance', 'Insufficient funds', async (value, ctx) => {
          const { asset, fees } = ctx.parent as SendFormValues;
          const { balances, baseFee } = ctx.options.context as SchemaOptions;

          const balanceAssetSelected = balances?.find(
            ({ assetId }) => assetId === asset
          );
          if (!balanceAssetSelected?.amount || !value) {
            return false;
          }

          if (value.gt(balanceAssetSelected.amount)) {
            return false;
          }

          const isSendingBaseAssetId =
            asset &&
            provider?.getBaseAssetId().toLowerCase() === asset.toLowerCase();
          if (isSendingBaseAssetId) {
            // It means "baseFee" is being calculated
            if (!baseFee) {
              return true;
            }

            const totalAmount = value.add(baseFee.add(fees.tip.amount));
            return totalAmount.lte(bn(balanceAssetSelected.amount));
          }

          return true;
        })
        .required('Amount is required'),
      address: yup
        .string()
        .required('Address is required')
        .test('is-user-address', async (value, ctx) => {
          try {
            if (!provider) {
              return true;
            }
            if (!isB256(value)) {
              return ctx.createError({
                message: 'Address is not a valid',
              });
            }
            const standardizedAddress = Address.fromString(value).toString();
            const accountType =
              await provider?.getAddressType(standardizedAddress);
            if (accountType !== 'Account') {
              return ctx.createError({
                message: `You can't send to ${accountType} address`,
              });
            }

            const assetCached = await AssetsCache.getInstance().getAsset({
              chainId: provider.getChainId(),
              assetId: value,
              dbAssets: [],
              save: false,
            });

            if (
              assetCached &&
              AssetsCache.getInstance().assetIsValid(assetCached)
            ) {
              return ctx.createError({
                message: `You can't send to Asset address`,
              });
            }

            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        }),
      fees: yup
        .object({
          tip: yup.object({
            amount: yup
              .mixed<BN>()
              .test(
                'min',
                'Tip must be greater than or equal to 0',
                (value) => {
                  return value?.gte(0);
                }
              )
              .test({
                name: 'max',
                test: (value, ctx) => {
                  const { asset, amount } = ctx.from?.[2]
                    .value as SendFormValues; // Two levels up
                  const { balances, baseFee } = ctx.options
                    .context as SchemaOptions;

                  const balanceAssetSelected = balances?.find(
                    ({ assetId }) => assetId === asset
                  );

                  // It means "baseFee" and/or "current balance" is being calculated
                  if (!balanceAssetSelected?.amount || !value || !baseFee) {
                    return true;
                  }

                  const balance = bn(balanceAssetSelected.amount);

                  const totalBlocked = baseFee.add(bn(amount));
                  const totalAmount = totalBlocked.add(value);
                  if (totalAmount.lte(balance) || value.isZero()) {
                    return true;
                  }

                  return totalAmount.lte(balance);
                },
              })
              .required('Tip is required'),
            text: yup.string().required('Tip is required'),
          }),
          gasLimit: yup.object({
            amount: yup
              .mixed<BN>()
              .test({
                name: 'max',
                test: (value, ctx) => {
                  const { maxGasLimit } = ctx.options.context as SchemaOptions;
                  if (!maxGasLimit) return false;

                  if (value?.lte(maxGasLimit)) {
                    return true;
                  }

                  return ctx.createError({
                    path: 'fees.gasLimit',
                    message: `Gas limit must be lower than or equal to ${formatGasLimit(
                      maxGasLimit
                    )}.`,
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
  address: '',
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
  const { account } = useAccounts();
  const provider = useProvider();

  const service = useInterpret(() =>
    sendMachine.withConfig({
      actions: {
        goToHome() {
          navigate(Pages.index());
        },
        callTransactionRequest(ctx) {
          const {
            providerUrl,
            transactionRequest,
            address,
            baseFee,
            regularTip,
            fastTip,
            maxGasLimit,
          } = ctx;
          if (!providerUrl || !transactionRequest || !address) {
            throw new Error('Params are required');
          }

          txRequest.handlers.request({
            providerUrl,
            transactionRequest,
            address,
            fees: {
              baseFee,
              regularTip,
              fastTip,
              maxGasLimit,
            },
            skipCustomFee: true,
          });
        },
      },
    })
  );

  const baseFee = useSelector(service, selectors.baseFee);
  const gasLimit = useSelector(service, selectors.gasLimit);
  const maxGasLimit = useSelector(service, selectors.maxGasLimit);
  const errorMessage = useSelector(service, selectors.error);

  const resolver = useMemo(
    () => yupResolver(schemaFactory(provider)),
    [provider]
  );
  const form = useForm<SendFormValues>({
    resolver,
    mode: 'onSubmit',
    defaultValues: DEFAULT_VALUES,
    context: {
      balances: account?.balances,
      baseFee,
      gasLimit,
      maxGasLimit,
    },
  });

  const tip = useWatch({
    control: form.control,
    name: 'fees.tip.amount',
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

  const balanceAssetSelected = useMemo<BN>(() => {
    const asset = account?.balances?.find(
      ({ assetId }) => assetId === assetIdSelected
    );
    if (!asset) return bn(0);

    return bn(asset.amount);
  }, [account?.balances, assetIdSelected]);

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
    const { unsubscribe } = form.watch(() => {
      const { address, asset, amount } = form.getValues();
      if (address) {
        form.trigger('address');
      }
      if (!address || !asset || amount == null || amount?.eq(0)) {
        return;
      }

      form.handleSubmit((data) => {
        const { address, asset, amount, fees } = data;

        const input: TxInputs['createTransfer'] = {
          to: address,
          assetId: asset,
          amount,
          tip: fees.tip.amount,
          gasLimit: fees.gasLimit.amount,
        };

        service.send('SET_INPUT', { input });
        form.trigger('amount');
      })();
    });

    return () => unsubscribe();
  }, [
    form.watch,
    form.getValues,
    form.trigger,
    form.handleSubmit,
    service.send,
  ]);

  return {
    form,
    baseFee,
    gasLimit,
    tip,
    regularTip,
    fastTip,
    status,
    readyToSend,
    account,
    txRequest,
    assetIdSelected,
    balances: account?.balances,
    balanceAssetSelected,
    errorMessage,
    provider,
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
