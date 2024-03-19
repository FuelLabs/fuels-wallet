import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';

import type { CreatePasswordValues } from '../components';
import { useSignUpProvider } from '../components/SignUpProvider';
import type { SignUpMachineState } from '../machines/signUpMachine';

export enum SignUpScreen {
  showing = 'showing',
  waiting = 'waiting',
  password = 'password',
  failed = 'failed',
}

const selectors = {
  context: (state: SignUpMachineState) => state.context,
  screen: (state: SignUpMachineState) => {
    if (state.matches('create.showingMnemonic')) return SignUpScreen.showing;
    if (state.matches('create.confirmMnemonic')) return SignUpScreen.waiting;
    return SignUpScreen.password;
  },
  isLoading(state: SignUpMachineState) {
    return state.hasTag('loading');
  },
};

export function useSignUp() {
  const navigate = useNavigate();
  const { service } = useSignUpProvider();
  const { send } = service;

  const ctx = useSelector(service, selectors.context);
  const screen = useSelector(service, selectors.screen);
  const isLoading = useSelector(service, selectors.isLoading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const sub = service.subscribe((state) => {
      if (state.matches('atWelcome')) {
        navigate(Pages.signUpWelcome(), {
          replace: true,
        });
      }
      if (state.matches('aggrement')) {
        navigate(Pages.signUpTerms(), {
          replace: true,
        });
      }
      if (state.matches('import')) {
        navigate(Pages.signUpRecoverWallet(), {
          replace: true,
        });
      }
      if (state.matches('create.showingMnemonic')) {
        navigate(Pages.signUpCreateWallet(), {
          replace: true,
        });
      }
      if (state.matches('create.confirmMnemonic')) {
        navigate(Pages.signUpConfirmWallet(), {
          replace: true,
        });
      }
      if (state.matches('addingPassword')) {
        navigate(Pages.signUpEncryptWallet(), {
          replace: true,
        });
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  function next() {
    send('NEXT');
  }

  function confirmMnemonic(words: string[]) {
    send('CONFIRM_MNEMONIC', { data: { words } });
  }

  function importMnemonic(words: string[]) {
    send('IMPORT_MNEMONIC', { data: { words } });
  }

  function createManager({ password }: CreatePasswordValues) {
    send('CREATE_MANAGER', { data: { password } });
  }

  function reset() {
    send('RESET');
  }

  function goToCreate() {
    send('CREATE');
  }

  function goToRecover() {
    send('IMPORT');
  }

  return {
    handlers: {
      next,
      reset,
      importMnemonic,
      confirmMnemonic,
      createManager,
      goToCreate,
      goToRecover,
    },
    context: {
      ...ctx,
      screen,
      isLoading,
    },
  };
}
