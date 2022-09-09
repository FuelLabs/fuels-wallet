import { useSelector } from "@xstate/react";

import type { AccountsMachineState } from "../machines";

import { useGlobalState } from "~/systems/Core";

const selectors = {
  accounts: (state: AccountsMachineState) => state.context.accounts,
  isLoading: (state: AccountsMachineState) => state.hasTag("loading"),
};

export function useAccounts() {
  const { accountsService } = useGlobalState();
  const isLoading = useSelector(accountsService, selectors.isLoading);
  const accounts = useSelector(accountsService, selectors.accounts);

  return {
    accounts,
    isLoading,
    currentAccount: accounts?.[0],
  };
}
