/* eslint-disable @typescript-eslint/consistent-type-imports */
import { liveQuery } from "dexie";
import type { StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { getBalances } from "../services";
import type { Account } from "../types";

import { db } from "~/systems/Core";
import type { Maybe } from "~/systems/Core";

type MachineContext = {
  accounts?: Maybe<Account[]>;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: Maybe<Account[]>;
  };
  fetchBalances: {
    data: Maybe<Account[]>;
  };
};

type MachineEvents = { type: "SET_ACCOUNTS"; data: Account[] };

export const accountsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgDMwAXHAqAQU0wHsBXfS2AYgicJIIBuTANZgSaLHkKkK1KfUat2sBIKaZ0lXLwDaABgC6iUAAcmsXFt7GQAD0QBaABwknARgDMATgCsAFh8fADYAdg83EL03ABoQAE9ENy8QkhCggCYAkJ8nfz10pxCAXyLYiRppcioKhWY2Dk4wACcmpiaSEwAbTTI21HEMCuIquVoGOuVVfCENK3x9IyQQMws5m3sEdNCSLz1szPDQkM9YhIQ-LxIPUL09Py30vR9brxKywalh2RqAIXRu-CYODcXhiNSiAaSAhfaryP4AoEqNSzbTzQw2FaWVHrRwpDz4vxOdJJPRBALpAqnRCEnypY5OJx6LxJPzZDxvEDlT4yWG0eHoQHA5qtdpdHp9SFDHmjfBQfmCpHTdSaVELDHmLHWJYbLZ6K6E4mEryskLuHxUhAeYkkKL4pweSJedx+NwcrnQ0g8QicADKAFEACoAfToAGFQwB5ACqADkAz71atsdrED5IlddhcrZkfFs-BafBESOkfE70k6Qn4XcaSqUQPgmBA4DZ3ZVvvJxkoOInNfgcQgHI9i+kHR49Pbgj4PLmLQ6rkEgl4vN4gm4gkTS26Ph6Rr9-gLET21imB24XJWrRl7kunVOnLOrSQ3H47rlK-b7gut1C2+hcJ1ICPZNQA2QtLhdHIyWnPYni8AtaSXQ1l1XTwz1dOtW2GL0wCArUQMQCk9XJPZiSCDxWT8IICyeYtS3cXxKyedJvylXC+xPBwq2HUdx2nIIpxneJHHIkgyLHUln1NBinD8WsiiAA */
  createMachine(
    {
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
                actions: "assignAccounts",
                target: "fetchingBalances",
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
            src: "fetchBalances",
            onDone: [
              {
                actions: "assignAccounts",
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
        async fetchBalances({ accounts: _accounts }) {
          const accounts = _accounts || [];
          const balances = await Promise.all(
            accounts.map(({ publicKey }) => getBalances(publicKey))
          );

          const newAccounts: Account[] = await balances.reduce<
            Promise<Account[]>
          >(async (prev, cur, i) => {
            const prevAccounts: Account[] = await prev;

            const account = await db.setBalance({
              address: accounts[i].address || "",
              balances: cur,
              balanceSymbol: "$",
              balance: BigInt(0),
            });

            if (account) {
              return [...prevAccounts, account];
            }

            return prevAccounts;
          }, Promise.resolve([]));

          return newAccounts;
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
