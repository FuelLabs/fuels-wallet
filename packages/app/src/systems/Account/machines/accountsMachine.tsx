import { subscribe } from "@fuels-wallet/mediator";
import type { Sender, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { accountEvents, getBalances } from "..";
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

type MachineEvents =
  | { type: "SET_ACCOUNTS"; data: Account[] }
  | { type: "UPDATE_ACCOUNTS"; data: { account: Account } }
  | { type: "REFETCH" };

export const accountsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgDMwAXHAqAQU0wHsBXfS2AYgicJIIBuTANZgSaLHkKkK1KfUat2sBIKaZ0lXLwDaABgC6iUAAcmsXFt7GQAD0QBGAEx6SehwE4ArB71OAHE5eTgDM-gA0IACejh4ALCQAbADsXskeIXohIelecQC++ZESNNLkVKUKzGwcnGAATvVM9SQmADaaZM2o4hilxOVytAzVyqr4QhpW+PpGSCBmFtM29gjODiSZev5xu4leDiGJ7pExCCEeJHFOTh7+Hp6JiZ7+XoXFfVIDspUAQugdfCYODcXhiNSiXqSAjfCryf6A4EqNRTbQzQw2RaWNErRz+EIkTweUKZPI7LyBU6IOKJBKPYIpRKhBx5ApFEAlL4yOG0BHoIEghpNFrtTrdKH9blDfBQPkC5ETdSaNGzTHmbHWearELXQn+ZLJfX7AIskJUhAuDZ6PQGg5pfyJHWJd4cz4w0g8QicADKAFEACoAfToAGEQwB5ACqADl-d61UscVrEABaBzpTYhTx6YIMzIeZLm0JeEjEi45nwhLwXasuznukiesCcABKvoAYgGQwAJBMa-C4hBphKpJ7PfW7HKJfFFvSJK7OPz3AuvfWFdn4JgQOA2etlH7yEZKDh95bJofppwkV4ORIPB6vR0O800zZ3pwOOIGsL7bJ1t37jyMpykip5JqAqy3gSTIOA4egZAWcTONO5ohE4CRBME-g5vqPiBP+0L7uguBtJAYGahBiA5BsLiZPcFxbIW0SIMEVw3Hc75xBSVb+ARkqNmC5EDueaYZs4NzJB+063mOqE+CQBzoXBwQsncbIfIRxBCYOKa0Zm2a5k4jrwUxZwpmhCkGtauzWkc-j4m865AA */
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
            src: "listenUpdates",
          },
          on: {
            UPDATE_ACCOUNTS: {
              actions: "updateAccounts",
            },
            REFETCH: {
              target: "fetchingAccounts",
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
