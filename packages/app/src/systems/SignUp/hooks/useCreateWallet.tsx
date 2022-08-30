import { useMachine, useSelector } from "@xstate/react";
import { useEffect } from "react";

import type { CreatePasswordValues } from "../components";
import type { CreateWalletMachineState } from "../machines/createWallet";
import { createWalletMachine } from "../machines/createWallet";

const selectors = {
  context: (state: CreateWalletMachineState) => state.context,
  account: ({ context: ctx }: CreateWalletMachineState) => {
    if (!ctx.walletManager) return null;
    const manager = ctx.walletManager;
    const account = manager.getAccounts()[0];
    return {
      name: "Account 1",
      address: account.address.toAddress(),
    };
  },
};

export function useCreateWallet() {
  const [state, send, service] = useMachine(() => createWalletMachine);
  const ctx = useSelector(service, selectors.context);
  const account = useSelector(service, selectors.account);

  function next() {
    send("NEXT");
  }

  function confirmMnemonic(words: string[]) {
    send("CONFIRM_MNEMONIC", { data: { words } });
  }

  function checkMnemonicError() {
    return (
      ctx.attempts > 0 &&
      !ctx.isConfirmed &&
      "Sorry your mnemonic phrase doesn't match"
    );
  }

  function createManager({ password }: CreatePasswordValues) {
    send("CREATE_MANAGER", { data: { password } });
  }

  useEffect(() => {
    send("CREATE_MNEMONIC");
  }, []);

  return {
    state,
    handlers: {
      next,
      confirmMnemonic,
      checkMnemonicError,
      createManager,
    },
    data: {
      ...ctx,
      account,
    },
  };
}
