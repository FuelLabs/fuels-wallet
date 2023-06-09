import { useInterpret } from '@xstate/react';
import { createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import type {
  SignUpMachineService,
  SignUpType,
} from '../../machines/signUpMachine';
import { signUpMachine } from '../../machines/signUpMachine';

import { Pages } from '~/systems/Core';

type Context = {
  service: SignUpMachineService;
  type?: SignUpType;
};

const ctx = createContext<Context>({} as Context);
export function useSignUpProvider() {
  return useContext(ctx);
}

export function SignUpProvider() {
  const navigate = useNavigate();
  const service = useInterpret(() =>
    signUpMachine.withConfig({
      actions: {
        redirectToWalletCreated() {
          navigate(Pages.signUpWalletCreated());
        },
        redirectToWelcome() {
          navigate(Pages.signUpWelcome());
        },
      },
    })
  );

  return (
    <ctx.Provider value={{ service }}>
      <Outlet />
    </ctx.Provider>
  );
}
