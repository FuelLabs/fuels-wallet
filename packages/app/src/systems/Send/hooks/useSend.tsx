import { yupResolver } from '@hookform/resolvers/yup';
import { useInterpret, useSelector } from '@xstate/react';
import { bn, isBech32 } from 'fuels';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import type { SendMachineState } from '../machines/sendMachine';
import { SendScreens, sendMachine } from '../machines/sendMachine';

import { useAccounts } from '~/systems/Account';
import { ASSET_MAP, isEth } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { useChainInfo } from '~/systems/Network';
import {
  getFilteredErrors,
  getGroupedErrors,
  useParseTx,
} from '~/systems/Transaction';

function filterGeneralErrors(state: SendMachineState, prop: string) {
  if (!state.context.errors) return {};
  const all = getGroupedErrors(state.context.errors?.[prop]);
  const general = getFilteredErrors(all, ['InsufficientInputAmount']);
  const hasGeneral = Boolean(Object.keys(general || {}).length);
  return { all, general, hasGeneral };
}

const selectors = {
  inputs(state: SendMachineState) {
    return state.context.inputs;
  },
  response(state: SendMachineState) {
    return state.context.response;
  },
  screen(state: SendMachineState) {
    if (state.matches('confirming.unlocking')) return SendScreens.unlocking;
    if (state.matches('confirming.idle')) return SendScreens.confirm;
    return SendScreens.select;
  },
  isLoading(state: SendMachineState) {
    return (
      state.hasTag('loading') ||
      state.children.unlock?.state.matches('unlocking')
    );
  },
  canConfirm(state: SendMachineState) {
    const errors = state.context.errors || {};
    const hasErrors = Object.values(errors).some(Boolean);
    return !hasErrors;
  },
  errors(state: SendMachineState) {
    return {
      unlock: state.context.errors?.unlockError,
      transactionRequest: filterGeneralErrors(state, 'txRequestErrors'),
      transactionResponse: filterGeneralErrors(state, 'txApproveErrors'),
    };
  },
  showTxDetails(state: SendMachineState) {
    const { response } = state.context;
    return response?.fee?.gt(0);
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
          reset();
          navigate(Pages.index());
        },
      },
    })
  );

  const inputs = useSelector(service, selectors.inputs);
  const response = useSelector(service, selectors.response);
  const canConfirm = useSelector(service, selectors.canConfirm);
  const screen = useSelector(service, selectors.screen);
  const isLoading = useSelector(service, selectors.isLoading);
  const errors = useSelector(service, selectors.errors);
  const showTxDetails = useSelector(service, selectors.showTxDetails);

  const { chainInfo, isLoading: isLoadingChainInfo } = useChainInfo(
    inputs?.wallet?.provider.url
  );
  const tx = useParseTx({
    transaction: response?.transactionRequest?.toTransaction(),
    receipts: response?.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFactor: chainInfo?.consensusParameters.gasPriceFactor,
  });
  const ethAmountSent = useMemo(
    () => bn(tx?.totalAssetsSent?.find(isEth)?.amount),
    [tx?.totalAssetsSent]
  );

  function reset() {
    service.send('RESET');
  }
  function unlock(password: string) {
    service.send('UNLOCK_WALLET', { input: { password, account } });
  }
  function cancel() {
    service.send('BACK');
  }
  function confirm() {
    const asset = ASSET_MAP[form.getValues('asset')];
    const amount = bn(form.getValues('amount'));
    const address = form.getValues('address');
    service.send('CONFIRM', { input: { asset, amount, address } });
  }

  return {
    form,
    inputs,
    response,
    errors,
    screen,
    canConfirm,
    tx,
    showTxDetails,
    ethAmountSent,
    isLoading: isLoading || isLoadingChainInfo,
    handlers: {
      cancel,
      confirm,
      unlock,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
