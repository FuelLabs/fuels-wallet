import type { Sender, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { accountEvents } from "..";
import type { Account } from "../types";

import type { Maybe } from "~/systems/Core";
import { subscribe, db } from "~/systems/Core";

type MachineContext = {
  accounts?: Maybe<Account[]>;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Maybe<Account[]>;
  };
};

type MachineEvents =
  | { type: "SET_ACCOUNTS"; data: Account[] }
  | { type: "UPDATE_ACCOUNTS"; data: { account: Account } };

export const accountsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import("./accountsMachine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "(machine)",
    initial: "fetching",
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      fetching: {
        invoke: {
          src: "fetchAccounts",
          onDone: {
            target: "done",
            actions: "assignAccounts",
          },
          onError: {
            target: "failed",
            actions: "assignError",
          },
        },
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
            actions: "updateAccounts",
          },
        },
      },
    },
  },
  {
    actions: {
      assignAccounts: assign({ accounts: (_, ev) => ev.data }),
      assignError: assign({ error: (_, ev) => ev.data }),
      updateAccounts: assign({
        accounts: (ctx, ev) => ctx.accounts?.concat([ev.data.account]),
      }),
    },
    services: {
      async fetchAccounts() {
        return db.getAccounts();
      },
      listenUpdates: () => (send: Sender<MachineEvents>) => {
        const sub = subscribe(accountEvents.accountCreated, (account) => {
          send({ type: "UPDATE_ACCOUNTS", data: { account } });
        });
        return sub.unsubscribe;
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineState = StateFrom<AccountsMachine>;
