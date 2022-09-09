import type { StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { getBalances } from "../services";

import { db } from "~/systems/Core";

type MachineContext = {
  error?: unknown;
};

type MachineServices = {
  fetchBalances: {
    data: void;
  };
};

export const accountsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgDMwAXHAqAIXQBt19M4BiCAe0JIIDcuAazAk0WPIVIVqk+kxZtYCAV0zpKuHgG0ADAF1EoAA5dYuTTyMgAHogAs9gKwlnTgJwB2J7s-uATJ4AjABs9gA0IACeDiEkIX4huj4AHEn+TvYAzAC+OZHiNFLkVEXyzKwcYABO1VzVJMbMlGT1qGIYRcQlsrQMFUoq+ILqlvh6hkggpuZj1nYIji5uXj5+gaER0YhBWVnxfsEJ7glB9u4pefkg+FwQcNaFkt0yZf2KD1MzFlr484j+M4kXZOEIpPbebIpJxZSIxBBBZIHVZeDJBdxZfwhPIFTrPaToXCMSDWb5zKYLML+eLojFZdz2TzgkJwgGeTzAvxpJz+fxePb2HEgJ4EbrcQiksw-KwUxBUmnuOkMplZFnbBBJTknFIpezgoKhXVCkVSSWzX7-BHuXTArKg8FZSFZaGw9UAWgyJExulVIRhjiyBt0-iuOSAA */
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import("./accountsMachine.typegen").Typegen0,
      schema: {
        context: {} as MachineContext,
        services: {} as MachineServices,
      },
      predictableActionArguments: true,
      id: "(machine)",
      initial: "fetchingBalances",
      states: {
        fetchingBalances: {
          invoke: {
            src: "fetchBalances",
            onDone: [
              {
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
        assignError: assign({ error: (_, ev) => ev.data }),
      },
      services: {
        async fetchBalances() {
          const accounts = await db.getAccounts();
          const balances = await Promise.all(
            accounts.map(({ publicKey }) => getBalances(publicKey))
          );

          await balances.reduce(async (prev, cur, i) => {
            await prev;

            await db.setBalance({
              address: accounts[i].address || "",
              balances: cur,
              balanceSymbol: "$",
              balance: BigInt(0),
            });
          }, Promise.resolve());
        },
      },
    }
  );

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineState = StateFrom<AccountsMachine>;
