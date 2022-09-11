import { useSelector } from "@xstate/react";

import type { AccountsMachineState } from "../machines";

import { useGlobalMachines } from "~/systems/Core";

const selectors = {
  accounts: (state: AccountsMachineState) => state.context.accounts,
  isLoading: (state: AccountsMachineState) => state.hasTag("loading"),
};

export function useAccounts() {
  const { accountsService } = useGlobalMachines();
  const isLoading = useSelector(accountsService, selectors.isLoading);
  const accounts = useSelector(accountsService, selectors.accounts);

  function refetch() {
    accountsService.send("REFETCH");
  }

  return {
    accounts,
    isLoading,
    currentAccount: accounts?.[0],
    handlers: {
      refetch,
    },
  };
}
