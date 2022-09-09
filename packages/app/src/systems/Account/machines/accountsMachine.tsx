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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgDMwAXHAqAQU0wHsBXfS2AYgicJIIBuTANZgSaLHkKkK1KfUat2sBIKaZ0lXLwDaABgC6iUAAcmsXFt7GQAD0QBaABwknARgDMATgBMAFgBWADYvNz0AdnCvcIAaEABPRH8-ElCo8KcfDzdwn38AX3y4iRppcipShWY2Dk4wACd6pnqSEwAbTTJm1HEMUuJyuVoGauVVfCENK3x9IyQQMwtpm3sED3WSPy23IL1s7Kc9IIC4xIQ-LxIPIJCnSKCPP1y9J0LivqkB2UqAIXQO-CYODcXhiNSiXqSAhfCryP4AoEqNRTbQzQw2RaWVErJIeEgRa5BXLEpweJzHU6IPzuVwePJBUkePYBJx+DxvEAlT4yWG0eHoQHAhpNFrtTrdSH9HlDfBQfmCpETdSaVGzDHmLHWeardYpXx+II+O5uJyk4KUtZ6NxXHwvR7rdyHa4crnQ0g8QicADKAFEACoAfToAGFgwB5ACqADk-V71UtsdrEAEoiQQraAlk6QEjh4LSm9CQAsXIhkiQ72Rz8EwIHAbK6yt95CMlBx45r8DiEA5bSQ8h5wkyzccPJmLQOrjcvF5vEEdpkAl4XR83YNfv8BYj28sk92TSRwmyfIa-D5p14nAEyeO6SQ3H49NSU9THsegsuoY30Lg2pBt4nQFWY5wlcTMnSZLw-E8PMEkQQ1J1uMJqUPB83A-KUSA9MB-y1QCqWiA8IhTLIc2yIILQfECDWPLxMxePQ9DPdDuRwztdwcLY+yyQc7WCK8x1g7tHjTdYGJLI43Bzd9CnyIA */
  createMachine(
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
        async fetchBalances() {
          const accounts = await db.getAccounts();
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
