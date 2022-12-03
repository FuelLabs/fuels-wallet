import { useInterpret, useSelector } from '@xstate/react';
import type { BN } from 'fuels';
import { useNavigate } from 'react-router-dom';

import type { SendMachineState } from '../machines/sendMachine';
import { SendScreens, sendMachine } from '../machines/sendMachine';

import { useAccount } from '~/systems/Account';
import type { AssetSelectInput } from '~/systems/Asset';
import { Pages } from '~/systems/Core';
import { getFilteredErrors, getGroupedErrors } from '~/systems/Transaction';

function filterGeneralErrors(state: SendMachineState, prop: string) {
  if (!state.context.errors) return {};
  const all = getGroupedErrors(state.context.errors?.[prop]);
  const general = getFilteredErrors(all, ['InsufficientInputAmount']);
  const hasGeneral = Boolean(Object.keys(general || {}).length);
  return { all, general, hasGeneral };
}

const selectors = {
  screen(state: SendMachineState) {
    if (state.matches('unlocking')) return SendScreens.unlocking;
    if (state.matches('confirming')) return SendScreens.confirm;
    return SendScreens.select;
  },
  isLoading(state: SendMachineState) {
    return (
      state.matches('idle.creatingTx') ||
      state.matches('confirming.sendingTx') ||
      state.children.unlock?.state.matches('unlocking')
    );
  },
  canConfirm(state: SendMachineState) {
    return state.matches('idle.waitingConfirm') || state.matches('confirming');
  },
  inputs(state: SendMachineState) {
    return state.context.inputs;
  },
  response(state: SendMachineState) {
    return state.context.response;
  },
  errors(state: SendMachineState) {
    return {
      unlock: state.context.errors?.unlockError,
      txRequest: filterGeneralErrors(state, 'txRequestErrors'),
      txApprove: filterGeneralErrors(state, 'txApproveErrors'),
    };
  },
};

export function useSend() {
  const navigate = useNavigate();
  const { account, isLoading: isLoadingAccount } = useAccount();
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

  function reset() {
    service.send('RESET');
  }
  function cancel() {
    service.send('BACK');
  }
  function confirm() {
    service.send('CONFIRM');
  }

  function setAsset(asset?: AssetSelectInput | null) {
    service.send('SET_ASSET', { input: asset });
  }
  function setAddress(address: string) {
    service.send('SET_ADDRESS', { input: address });
  }
  function setAmount(amount: BN) {
    service.send('SET_AMOUNT', { input: amount });
  }
  function unlock(password: string) {
    service.send('UNLOCK_WALLET', { input: { password, account } });
  }

  return {
    inputs,
    response,
    errors,
    screen,
    canConfirm,
    isLoading: isLoading || isLoadingAccount,
    handlers: {
      cancel,
      confirm,
      setAsset,
      setAddress,
      setAmount,
      unlock,
    },
  };
}

export type UseSendReturn = ReturnType<typeof useSend>;
