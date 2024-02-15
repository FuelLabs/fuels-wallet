import { resolver, type Domain } from '@fuel-domains/sdk';
import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import type { BigNumberish } from 'fuels';
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
import { type TxInputs } from '~/systems/Transaction/services';

import type { SendMachineState } from '../machines/sendMachine';
import { sendMachine } from '../machines/sendMachine';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  loadingTx = 'loadingTx',
}

const ADDRESS_REGEX = /[\w\d]+\.fuel\s/g;

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

const schema = yup
  .object({
    asset: yup.string().required('Asset is required'),
    amount: yup.string().required('Amount is required'),
    address: yup.string().required('Address or domain is required'),
  })
  .required();

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account, balanceAssets: accountBalanceAssets } = useAccounts();
  const { assets } = useAssets();
  const [domain, setDomain] = useState<Domain | null>(null);

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
          const _address = address.replace(ADDRESS_REGEX, '');
          txRequest.handlers.request({
            providerUrl,
            transactionRequest,
            address: _address,
          });
        },
      },
    })
  );

  const amount = form.watch('amount');
  const errorMessage = useSelector(service, selectors.error);

  useEffect(() => {
    if (bn(amount).gt(0) && form.formState.isValid) {
      const asset = assets.find(
        ({ assetId }) => assetId === form.getValues('asset')
      );
      const amount = bn(form.getValues('amount'));
      const address = domain?.resolver ?? form.getValues('address');
      const input = {
        account,
        asset,
        amount,
        address,
      } as TxInputs['isValidTransaction'];
      service.send('SET_DATA', { input });
    }
  }, [amount, form.formState.isValid]);

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
    const address = domain?.resolver ?? form.getValues('address');
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

  async function handleResolveNameOrAddress(addressOrName: string) {
    const isDomain = addressOrName.endsWith('.fuel');
    const isAddress = addressOrName.startsWith('fuel');

    setDomain(null);

    if (isDomain) {
      // TODO: Change to use current network
      const domain = await resolver({
        providerURL: import.meta.env.VITE_FUEL_PROVIDER_URL,
        domain: addressOrName.replace('.fuel', ''),
      });

      if (domain) {
        setDomain(domain);
      } else {
        form.setError('address', {
          type: 'pattern',
          message: 'Not found domain',
        });
      }
    }

    if (isAddress) {
      try {
        isBech32(addressOrName);
      } catch (error) {
        form.setError('address', {
          type: 'pattern',
          message: 'Invalid bech32 address',
        });
      }
    }
  }

  return {
    fee,
    form,
    title,
    domain,
    status,
    account,
    txRequest,
    readyToSend,
    balanceAssets,
    assetIdSelected,
    balanceAssetSelected,
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
      handleValidateAmount,
      handleResolveNameOrAddress,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
