import { useInterpret, useSelector } from "@xstate/react";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";

import type { AccountsMachineState } from "../../machines/accountsMachine";
import { accountsMachine } from "../../machines/accountsMachine";
import type { Account } from "../../types";

import type { Maybe } from "~/types";

type Context = {
  accounts?: Maybe<Account[]>;
  isLoading?: boolean;
};

const ctx = createContext<Context>({});

const selectors = {
  accounts: (state: AccountsMachineState) => state.context.accounts,
  isLoading: (state: AccountsMachineState) => state.matches("fetching"),
};

type AccountProviderProps = {
  children: ReactNode;
};

export function AccountProvider({ children }: AccountProviderProps) {
  const service = useInterpret(() => accountsMachine);
  const isLoading = useSelector(service, selectors.isLoading);
  const accounts = useSelector(service, selectors.accounts);

  return (
    <ctx.Provider value={{ accounts, isLoading }}>{children}</ctx.Provider>
  );
}

export function useAccounts() {
  return useContext(ctx);
}
