import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { InterpreterFrom } from "xstate";

import { accountsMachine } from "~/systems/Account";

const GlobalStateContext = createContext({
  accountsService: {} as InterpreterFrom<typeof accountsMachine>,
});

type GlobalStateProviderProps = {
  children: ReactNode;
};

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const accountsService = useInterpret(accountsMachine);

  return (
    <GlobalStateContext.Provider value={{ accountsService }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
