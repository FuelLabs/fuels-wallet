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
        },
      })
      .withContext({
        type,
        attempts: 0,
      })
  );

  const ctx = useSelector(service, selectors.context);

  function next() {
    send('NEXT');
  }

  function confirmMnemonic(words: string[]) {
    send('CONFIRM_MNEMONIC', { data: { words } });
  }

  function checkMnemonicError() {
    return (
      ctx.attempts > 0 &&
      !ctx.isConfirmed &&
      "Sorry your mnemonic phrase doesn't match"
    );
  }

  function createManager({ password }: CreatePasswordValues) {
    send('CREATE_MANAGER', { data: { password } });
  }

  useEffect(() => {
    if (type === SignUpType.create) send('CREATE_MNEMONIC');
  }, []);

  return {
    state,
    handlers: {
      next,
      confirmMnemonic,
      checkMnemonicError,
      createManager,
    },
    context: {
      ...ctx,
    },
  };
}
