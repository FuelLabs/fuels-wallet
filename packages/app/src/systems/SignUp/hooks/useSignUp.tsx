import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

import type { CreatePasswordValues } from '../components';
import { useSignUpProvider } from '../components/SignUpProvider';
import type { SignUpMachineState } from '../machines/signUpMachine';
import { SignUpType } from '../machines/signUpMachine';

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

  useEffect(() => {
    if (type === SignUpType.create) send('CREATE_MNEMONIC');
  }, []);

  return {
    handlers: {
      next,
      confirmMnemonic,
      createManager,
    },
    context: {
      ...ctx,
      screen,
      isValidMnemonic,
      isLoading,
    },
  };
}
