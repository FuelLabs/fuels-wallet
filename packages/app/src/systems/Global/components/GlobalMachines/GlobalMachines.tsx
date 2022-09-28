import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/** We need to import using /machines here because of cycle-dependencies */
import type { AccountsMachineService } from "~/systems/Account";
import { accountsMachine } from "~/systems/Account/machines";

const GlobalMachinesContext = createContext({
  accountsService: {} as AccountsMachineService,
});

type GlobalMachinesProviderProps = {
  children: ReactNode;
};

export const GlobalMachinesProvider = ({
  children,
}: GlobalMachinesProviderProps) => {
  const accountsService = useInterpret(() => accountsMachine);

  return (
    <GlobalMachinesContext.Provider value={{ accountsService }}>
      {children}
    </GlobalMachinesContext.Provider>
  );
};

export function useGlobalMachines() {
  return useContext(GlobalMachinesContext);
}
