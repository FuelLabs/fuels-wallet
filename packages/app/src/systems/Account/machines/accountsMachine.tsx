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
        type: "final",
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
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineState = StateFrom<AccountsMachine>;
