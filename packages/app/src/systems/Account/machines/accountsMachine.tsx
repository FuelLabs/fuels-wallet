import { subscribe } from "@fuels-wallet/mediator";
import type { Sender, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { accountEvents, AccountService } from "..";
import type { Account } from "../types";

import { IS_LOGGED_KEY } from "~/config";

type MachineContext = {
  accounts?: Record<string, Account>;
  account?: Account;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Account[];
  };
  fetchBalance: {
    data: Account;
  };
};

type MachineEvents =
  | { type: "SET_ACCOUNTS"; data: Account[] }
  | { type: "UPDATE_ACCOUNTS"; data: Account[] }
  | { type: "REFETCH" };

export const accountsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import("./accountsMachine.typegen").Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: "(machine)",
    initial: "fetchingAccounts",
    states: {
      fetchingAccounts: {
        invoke: {
          src: "fetchAccounts",
          onDone: [
            {
              actions: ["assignAccounts", "setLocalStorage"],
              target: "fetchingBalances",
              cond: "hasAccount",
            },
            {
              actions: ["removeLocalStorage"],
              target: "done",
            },
          ],
          onError: [
            {
              actions: "assignError",
              target: "failed",
            },
          ],
        },
        tags: "loading",
      },
      fetchingBalances: {
        invoke: {
          src: "fetchBalance",
          onDone: [
            {
              actions: ["assignAccount"],
              target: "done",
            },
          ],
          onError: [
            {
              actions: "assignError",
              target: "failed",
            },
          ],
        },
        tags: "loading",
      },
      failed: {
        type: "final",
      },
      done: {
        invoke: {
          src: "listenUpdates",
        },
        on: {
          UPDATE_ACCOUNTS: {
            actions: ["assignAccounts"],
            target: "fetchingBalances",
          },
        },
      },
    },
  },
  {
    actions: {
      assignAccounts: assign((_, ev) => ({
        account: ev.data[0],
        accounts: AccountService.toMap(ev.data),
      })),
      assignAccount: assign((ctx, ev) => {
        const account = ev.data;
        const accounts = { ...ctx.accounts, [account.address]: account };
        return { account, accounts };
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      setLocalStorage: () => {
        localStorage.setItem(IS_LOGGED_KEY, "true");
      },
      removeLocalStorage: () => {
        localStorage.removeItem(IS_LOGGED_KEY);
      },
    },
    services: {
      async fetchAccounts() {
        return AccountService.getAccounts();
      },
      async fetchBalance({ account }) {
        return AccountService.fetchBalance({ account });
      },
      listenUpdates: () => (send: Sender<MachineEvents>) => {
        const sub = subscribe(accountEvents.updateAccounts, async () => {
          const accounts = await AccountService.getAccounts();
          send({ type: "UPDATE_ACCOUNTS", data: accounts });
        });

        return () => {
          sub.unsubscribe();
        };
      },
    },
    guards: {
      hasAccount: (_, ev) => Boolean(ev?.data?.length),
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineState = StateFrom<AccountsMachine>;
