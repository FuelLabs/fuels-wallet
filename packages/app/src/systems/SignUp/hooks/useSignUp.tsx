import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CreatePasswordValues } from '../components';
import { STORAGE_KEY, useSignUpProvider } from '../components/SignUpProvider';
import type { SignUpMachineState } from '../machines/signUpMachine';
import { SignUpType } from '../machines/signUpMachine';

import { Pages, Storage } from '~/systems/Core';

export enum SignUpScreen {
  showing = 'showing',
  waiting = 'waiting',
  password = 'password',
  failed = 'failed',
}

const selectors = {
  context: (state: SignUpMachineState) => state.context,
  screen: (state: SignUpMachineState) => {
    if (state.matches('showingMnemonic')) return SignUpScreen.showing;
    if (state.matches('waitingMnemonic')) return SignUpScreen.waiting;
    if (state.matches('failed')) return SignUpScreen.failed;
    return SignUpScreen.password;
  },
  isValidMnemonic(state: SignUpMachineState) {
    return state.matches('waitingMnemonic.validMnemonic');
  },
  isLoading(state: SignUpMachineState) {
    return state.hasTag('loading');
  },
};

export function useSignUp() {
  const { service, type } = useSignUpProvider();
  const { send } = service;
  const navigate = useNavigate();

  const ctx = useSelector(service, selectors.context);
  const screen = useSelector(service, selectors.screen);
  const isValidMnemonic = useSelector(service, selectors.isValidMnemonic);
  const isLoading = useSelector(service, selectors.isLoading);

  function next() {
    send('NEXT');
  }

  function confirmMnemonic(words: string[]) {
    send('CONFIRM_MNEMONIC', { data: { words } });
  }

  function createManager({ password }: CreatePasswordValues) {
    send('CREATE_MANAGER', { data: { password } });
  }

  function reset() {
    send('RESET');
  }

  function goToCreate() {
    Storage.setItem(STORAGE_KEY, SignUpType.create);
    navigate(Pages.signUpTerms({ action: 'create' }));
    next();
  }

  function goToRecover() {
    Storage.setItem(STORAGE_KEY, SignUpType.recover);
    navigate(Pages.signUpTerms({ action: 'recover' }));
    next();
  }

  useEffect(() => {
    if (type === SignUpType.create) send('CREATE_MNEMONIC');
  }, []);

  return {
    handlers: {
      next,
      reset,
      confirmMnemonic,
      createManager,
      goToCreate,
      goToRecover,
    },
    context: {
      ...ctx,
      screen,
      isValidMnemonic,
      isLoading,
    },
  };
}
