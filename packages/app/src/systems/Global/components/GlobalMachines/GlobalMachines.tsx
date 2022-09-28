import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

/** We need to import using /machines here because of cycle-dependencies */
import type { AccountsMachineService } from "~/systems/Account";
import { accountsMachine } from "~/systems/Account/machines";
import { Pages } from "~/systems/Core/types";
import type { NetworksMachineService } from "~/systems/Network";
import { networksMachine } from "~/systems/Network/machines";

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
  const accountsService = useInterpret(() => accountsMachine);
  const networksService = useInterpret(() => networksMachine, {
    actions: {
      redirectToList() {
        navigate(Pages.networks());
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
