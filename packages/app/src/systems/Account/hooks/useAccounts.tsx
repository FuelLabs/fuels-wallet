import { useMachine } from "@xstate/react";
import { useLiveQuery } from "dexie-react-hooks";

import { accountsMachine } from "../machines/accountsMachine";

import { db } from "~/systems/Core";

export function useAccounts() {
  const [state] = useMachine(accountsMachine);

  const accounts = useLiveQuery(() => db.accounts.toArray());

  return {
    accounts,
    isLoading: state.matches("fetchingBalances"),
    currentAccount: accounts?.[0],
  };
}
