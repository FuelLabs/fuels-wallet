import { useMachine, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CreatePasswordValues } from '../components';
import type { SignUpMachineState } from '../machines/signUpMachine';
import { signUpMachine, SignUpType } from '../machines/signUpMachine';

import { Pages } from '~/systems/Core';

const selectors = {
  context: (state: SignUpMachineState) => state.context,
};

export function useSignUp(type: SignUpType) {
  const navigate = useNavigate();
  const [state, send, service] = useMachine(() =>
    signUpMachine
      .withConfig({
        actions: {
          redirectToWalletCreated() {
            navigate(Pages.signUpWalletCreated());
          },
          refreshPage() {
            navigate(Pages.signUp());
          },
        },
      })
      .withContext({
        type,
      })
  );

  const ctx = useSelector(service, selectors.context);

  function next() {
    send('NEXT');
  }

  function confirmMnemonic(words: string[]) {
    send('CONFIRM_MNEMONIC', { data: { words } });
  }

  function createManager() {
    send('CREATE_MANAGER');
  }

  function createPassword({ password }: CreatePasswordValues) {
    send('CREATE_PASSWORD', { data: { password } });
  }

  function saveSignup() {
    send('SAVE_SIGNUP');
  }

  function cancel() {
    send('CANCEL');
  }

  useEffect(() => {
    if (type === SignUpType.create && state.matches('idle')) send('NEXT');
  }, []);

  return {
    state,
    handlers: {
      next,
      confirmMnemonic,
      createManager,
      createPassword,
      saveSignup,
      cancel,
    },
    context: {
      ...ctx,
    },
  };
}
