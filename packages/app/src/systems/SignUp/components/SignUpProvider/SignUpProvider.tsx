import { useInterpret } from '@xstate/react';
import { createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';

import type {
  SignUpMachineService,
  SignUpType,
} from '../../machines/signUpMachine';
import { signUpMachine } from '../../machines/signUpMachine';

type Context = {
  service: SignUpMachineService;
  type?: SignUpType;
};

const ctx = createContext<Context>({} as Context);

export function useSignUpProvider() {
  return useContext(ctx);
}

export function SignUpProvider({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const service = useInterpret(() =>
    signUpMachine.withConfig({
      actions: {
        redirectToWalletCreated() {
          navigate(Pages.signUpCreatedWallet());
        },
        redirectToWelcome() {
          navigate(Pages.signUpWelcome());
        },
      },
    })
  );

  return (
    <ctx.Provider value={{ service }}>{children || <Outlet />}</ctx.Provider>
  );
}
