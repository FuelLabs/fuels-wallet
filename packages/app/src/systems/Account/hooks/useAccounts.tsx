import { useSelector } from "@xstate/react";

import type { AccountsMachineState } from "../../Account/machines";
import { AccountService } from "../../Account/services";

import { useGlobalMachines } from "~/systems/Global";

const selectors = {
  isLoading: (state: AccountsMachineState) => state?.hasTag("loading"),
  account: (state: AccountsMachineState) => {
    return state?.context.account;
  },
  accounts: (state: AccountsMachineState) => {
    return AccountService.fromMap(state?.context.accounts || {});
  },
};

export function useAccounts() {
  const { accountsService } = useGlobalMachines();
  const isLoading = useSelector(accountsService, selectors.isLoading);
  const accounts = useSelector(accountsService, selectors.accounts);
  const account = useSelector(accountsService, selectors.account);

  function refetch() {
    accountsService.send("REFETCH");
  }

  return {
    accounts,
    isLoading,
    account,
    handlers: {
      refetch,
    },
  };
}
