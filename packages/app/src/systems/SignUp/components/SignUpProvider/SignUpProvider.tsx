import { useInterpret } from '@xstate/react';
import { createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import type { SignUpMachineService } from '../../machines/signUpMachine';
import { signUpMachine, SignUpType } from '../../machines/signUpMachine';

import { Pages, Storage } from '~/systems/Core';

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
  const type = getTypeFromStorage();
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
    <ctx.Provider value={{ service, type }}>
      <Outlet />
    </ctx.Provider>
  );
}

export const STORAGE_KEY = 'signUpType';
function getTypeFromStorage(): SignUpType {
  return Storage.getItem(STORAGE_KEY) ?? SignUpType.create;
}
