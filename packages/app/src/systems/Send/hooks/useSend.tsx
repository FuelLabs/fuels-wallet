import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import { Address, type BigNumberish } from 'fuels';
import { bn, isBech32 } from 'fuels';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAccounts } from '~/systems/Account';
import { useAssets } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionRequestMachine';
import type { TxInputs } from '~/systems/Transaction/services';

import { config, isValidDomain, resolver, reverseResolver } from '@bako-id/sdk';
import debounce from 'lodash.debounce';
import { sendMachine } from '../machines/sendMachine';
import type { SendMachineState } from '../machines/sendMachine';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  loadingTx = 'loadingTx',
}

const selectors = {
  fee(state: SendMachineState) {
    return state.context.fee;
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
  title(txStatus?: TxRequestStatus) {
    return useCallback(
      (state: SendMachineState) => {
        if (state.matches('creatingTx') || txStatus === TxRequestStatus.loading)
          return 'Creating transaction';
        return 'Send';
      },
      [txStatus]
    );
  },
};

const isValidAddress = (value: string) => {
  try {
    return Boolean(value && isBech32(value));
  } catch (_error) {
    return false;
  }
};

const schema = yup
  .object({
    asset: yup.string().required('Asset is required'),
    amount: yup.string().required('Amount is required'),
    address: yup.lazy((value) => {
      const addressSchema = yup
        .string()
        .required('Address or Bako Handle is required');

      const isHandle = value.startsWith('@');

      if (isHandle) {
        return addressSchema.test(
          'is-domain',
          'Invalid handle name',
          isValidDomain
        );
      }

      return addressSchema.test(
        'is-address',
        'Invalid bech32 address',
        isValidAddress
      );
    }),
  })
  .required();

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account, balanceAssets: accountBalanceAssets } = useAccounts();
  const { assets } = useAssets();
  const [bakoResolver, setBakoResolver] = useState<string>('');
  const [bakoName, setBakoName] = useState<string>('');

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

  const fetchBakoHandle = useCallback(
    debounce((name: string) => {
      resolver({
        providerURL: config.PROVIDER_DEPLOYED,
        domain: name,
      })
        .then((value) => {
          if (value) {
            setBakoResolver(value.resolver);
          } else {
            form.setError('address', {
              type: 'pattern',
              message: 'Not found bako handle.',
            });
          }
        })
        .catch(() => {
          form.setError('address', {
            type: 'pattern',
            message: 'Not found bako handle.',
          });
        });
    }, 500),
    []
  );

  const fetchBakoName = useCallback(
    debounce((resolver: string) => {
      reverseResolver({
        providerURL: config.PROVIDER_DEPLOYED,
        resolver,
      }).then((value) => {
        setBakoName(value ?? '');
      });
    }, 500),
    []
  );

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
  const errorMessage = useSelector(service, selectors.error);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setBakoResolver('');
    setBakoName('');

    if (address.includes('@') && isValidDomain(address)) {
      fetchBakoHandle(address);
    }

    if (isValidAddress(address)) {
      fetchBakoName(address);
    }
  }, [address]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!form.formState.isValid) return;

    const amount = bn(form.getValues('amount'));
    if (bn(amount).lt(0)) return;

    const address = form.getValues('address');
    if (address.startsWith('@') && !bakoResolver) return;

    const asset = assets.find(
      ({ assetId }) => assetId === form.getValues('asset')
    );
    const bech32Address = Address.fromAddressOrString(
      bakoResolver || address
    ).toAddress();
    const input = {
      account,
      asset,
      amount,
      address: bech32Address,
    } as TxInputs['isValidTransaction'];
    service.send('SET_DATA', { input });
  }, [amount, bakoResolver, form.formState.isValid]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (errorMessage) {
      form.setError('amount', {
        type: 'pattern',
        message: errorMessage.split(':')[0],
      });
    }
  }, [errorMessage]);

  const fee = useSelector(service, selectors.fee);
  const sendStatusSelector = selectors.status(txRequest.txStatus);
  const sendStatus = useSelector(service, sendStatusSelector);
  const readyToSend = useSelector(service, selectors.readyToSend);

  const titleSelector = selectors.title(txRequest.txStatus);
  const title = useSelector(service, titleSelector);

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

  return {
    form,
    fee,
    title,
    status,
    readyToSend,
    bakoName,
    bakoResolver,
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
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
