import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { InterpreterFrom } from "xstate";

import { accountsMachine } from "~/systems/Account";

const GlobalMachinesContext = createContext({
  accountsService: {} as InterpreterFrom<typeof accountsMachine>,
});

type GlobalMachinesProviderProps = {
  children: ReactNode;
};

export const GlobalMachinesProvider = ({
  children,
}: GlobalMachinesProviderProps) => {
  const accountsService = useInterpret(accountsMachine);

  return (
    <GlobalMachinesContext.Provider value={{ accountsService }}>
      {children}
    </GlobalMachinesContext.Provider>
  );
};

export function useGlobalMachines() {
  return useContext(GlobalMachinesContext);
}
