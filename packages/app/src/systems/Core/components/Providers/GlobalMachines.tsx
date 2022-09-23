import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Pages } from "../../types";

import type { AccountsMachineService } from "~/systems/Account";
import { accountsMachine } from "~/systems/Account";
import type { NetworksMachineService } from "~/systems/Network";
import { networksMachine } from "~/systems/Network";

const GlobalMachinesContext = createContext({
  accountsService: {} as AccountsMachineService,
  networksService: {} as NetworksMachineService,
});

type GlobalMachinesProviderProps = {
  children: ReactNode;
};

export const GlobalMachinesProvider = ({
  children,
}: GlobalMachinesProviderProps) => {
  const navigate = useNavigate();
  const accountsService = useInterpret(() => accountsMachine, {
    // devTools: true,
  });
  const networksService = useInterpret(() => networksMachine, {
    devTools: true,
    actions: {
      redirectToList() {
        navigate(Pages.networks);
      },
    },
  });

  return (
    <GlobalMachinesContext.Provider
      value={{ accountsService, networksService }}
    >
      {children}
    </GlobalMachinesContext.Provider>
  );
};

export function useGlobalMachines() {
  return useContext(GlobalMachinesContext);
}
