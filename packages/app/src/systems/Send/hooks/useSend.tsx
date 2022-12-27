import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import { bn, isBech32 } from 'fuels';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import type { SendMachineState } from '../machines/sendMachine';
import { sendMachine } from '../machines/sendMachine';

import { useAccounts } from '~/systems/Account';
import { ASSET_MAP } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useTransactionRequest } from '~/systems/DApp';
import type { TxInputs } from '~/systems/Transaction/services';

export enum SendStatus {
  loading = 'loading',
  selecting = 'selecting',
  invalid = 'invalid',
  confirming = 'confirming',
  failed = 'failed',
  success = 'success',
}

const selectors = {
  fee(state: SendMachineState) {
    return state.context.fee;
  },
  isLoading(state: SendMachineState) {
    return state.hasTag('loading');
  },
  isInvalid(state: SendMachineState) {
    return state.matches('invalid');
  },
};

const schema = yup
  .object({
    asset: yup.string().required('Asset is required'),
    amount: yup
      .string()
      .required('Amount is required')
      .test('is-number', 'Invalid amount value', (value) => {
        return bn(value).gt(0);
      }),
    address: yup
      .string()
      .required('Address is required')
      .test('is-address', 'Invalid bech32 address', (value) => {
        return Boolean(value && isBech32(value));
      }),
  })
  .required();

export function useSend() {
  const navigate = useNavigate();
  const txRequest = useTransactionRequest();
  const { account } = useAccounts();

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
  const isLoading = useSelector(service, selectors.isLoading);
  const isInvalid = useSelector(service, selectors.isInvalid);

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
      const asset = ASSET_MAP[form.getValues('asset')];
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

  return {
    form,
    fee,
    txRequest,
    isInvalid,
    isLoading: isLoading || txRequest.status('loading'),
    handlers: {
      cancel,
      submit,
      goHome,
      tryAgain,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
