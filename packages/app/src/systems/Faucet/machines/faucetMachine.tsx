import fetch from "cross-fetch";
import type { StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { VITE_FUEL_FAUCET_URL } from "~/config";
import { accountEvents } from "~/systems/Account";
import type { Maybe } from "~/systems/Core";

async function fetchFaucet(input: RequestInit) {
  const res = await fetch(VITE_FUEL_FAUCET_URL, {
    ...input,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

type MachineContext = {
  address?: Maybe<string>;
  captcha?: Maybe<string>;
  error?: unknown;
};

type MachineServices = {
  faucet: {
    data: void;
  };
};

export type StartFaucetData = {
  address: string;
  captcha?: string;
};
type MachineEvents = { type: "START_FAUCET"; data: StartFaucetData };

export const faucetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCGBXAxmALgWVUwAsBLAOzADoSIAbMAYgGUAVAQQCUWB9AMTYCqAYQCiLRKAAOAe1gkcJaWQkgAHogC0AJgDsATkp6ALADYjAVi0AGHbvMmAzABoQAT0QBGA1fM6P5jx0rBzsADkcAXwiXNCxcAmJyKljsBTIoBgglKnIAN2kAa2SMVITSCkoU3HIoBDzpTFQFJQBtKwBdFRk5ZuUkNU0PYMoPDxDHIx0THRmtF3cEX28rDxMTUL0fBxMAqJiS+MJy4ri0jLAAJwvpC8pJWibkG4BbSoP8I6S305q6snzGr02p1+t15Io+qB1AgNNsTJQjB4tEYrKY9KF-EjzPNEIirJQfFZQqEHOYiUEvFFoiAyNIIHAVFUPokKjR6F1ZOClCpodojFpKOYjIikWjVo5QjiYUFDKNzHp5TpJg4LHsQEyyl8mTUOT0ITzNA5RpQZlZ1qEUaTSVKPMSEbY9A4rHoXdsiWqNZ8KmgSPQILquZCBjCHKF8YEzDoMVYVjYSVLzA4HAjNrYUYiVc6Pe9NRUshQA70DTDRjpBSZbV5Q0ZQloLZK3IhE8mjJt1lpfGmVtnTrmwIX9f1eemRlNJtHY1HnI2S-zZf5iT5EYidFSIkA */
  createMachine(
    {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import("./faucetMachine.typegen").Typegen0,
      schema: {
        context: {} as MachineContext,
        services: {} as MachineServices,
        events: {} as MachineEvents,
      },
      predictableActionArguments: true,
      id: "faucetMachine",
      initial: "idle",
      states: {
        idle: {
          on: {
            START_FAUCET: {
              actions: ["assignAddress", "assignCaptcha"],
              target: "fauceting",
            },
          },
        },
        fauceting: {
          invoke: {
            src: "faucet",
            onDone: [
              {
                target: "showingDoneFeedback",
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
        showingDoneFeedback: {
          after: {
            "2000": {
              target: "done",
            },
          },
        },
        failed: {
          type: "final",
        },
        done: {
          entry: ["sendFaucetSuccess", "navigateToHome"],
          type: "final",
        },
      },
    },
    {
      actions: {
        assignAddress: assign({ address: (_, ev) => ev.data.address }),
        assignCaptcha: assign({ captcha: (_, ev) => ev.data.captcha }),
        assignError: assign({ error: (_, ev) => ev.data }),
        sendFaucetSuccess: () => accountEvents.faucetSuccess(),
        navigateToHome: () => {},
      },
      services: {
        faucet: async ({ address, captcha }) => {
          await fetchFaucet({
            method: "POST",
            body: JSON.stringify({
              address,
              captcha: captcha || "",
            }),
          });
        },
      },
    }
  );

export type FaucetMachine = typeof faucetMachine;
export type FaucetMachineState = StateFrom<FaucetMachine>;
