import { liveQuery } from "dexie";
import type { StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import type { Account } from "../types";

import type { Maybe } from "~/systems/Core";
import { db } from "~/systems/Core";

type MachineContext = {
  accounts?: Maybe<Account[]>;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Maybe<Account[]>;
  };
};

type MachineEvents = { type: "SET_ACCOUNTS"; data: Account[] };

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
          src: "listenAccountsUpdating",
        },
        on: {
          SET_ACCOUNTS: {
            actions: "assignAccounts",
          },
        },
      },
    },
  },
  {
    actions: {
      assignAccounts: assign({ accounts: (_, ev) => ev.data }),
      assignError: assign({ error: (_, ev) => ev.data }),
    },
    services: {
      async fetchAccounts() {
        return db.getAccounts();
      },
      listenAccountsUpdating: () => (send) => {
        const obs$ = liveQuery(() => db.getAccounts());
        const subscription = obs$.subscribe({
          next: (val) => send({ type: "SET_ACCOUNTS", data: val }),
        });
        return subscription.unsubscribe;
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineState = StateFrom<AccountsMachine>;
