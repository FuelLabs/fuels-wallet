import type { StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { VITE_FUEL_FAUCET_URL } from "~/config";
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
  isLoading?: Maybe<boolean>;
  error?: unknown;
};

type MachineServices = {
  faucet: {
    data: Maybe<boolean>;
  };
};

export type StartFaucetData = {
  address: string;
  captcha?: string;
};
type MachineEvents = { type: "START_FAUCET"; data: StartFaucetData };

export const faucetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCGBXAxmALgWVUwAsBLAOzADoSIAbMAYgGUAVAQQCUWB9AMTYCqAYQCiLRKAAOAe1gkcJaWQkgAHogC0AJgDsATkp6ALADYjAVi0AGHbvMmAzABoQAT0QBGA1fM6P5jx0rBzsADkcAXyiXMmkIOBU0LFwCYnIqGnoVGTkFJRV1BG0jLUpzIyMPDy1TPQ8TR1CXdyKgwyrzPU6dIx0HC2iQJOx8QlIKSmHccihs2XlFZSQ1TQcqyh0gk1DQo2DzB3Nmzx3KXq09Bys9G4cTK1DBqdG0ibQSegg53MWC1dCrJRAmYdKEPFYrODQc43IgDg4znobDUrJV+tcnhgRqlxlQIEowN8FvlloUNFUdGUTB4wZddqEtPTjgh4YirNstL5bHsPJjki9cUS8ktQGS9kYgToQWCIVDQjCWuSSu1-DcgtZbA4olEgA */
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
          entry: "startLoading",
          exit: "stopLoading",
          invoke: {
            src: "faucet",
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
        assignAddress: assign({ address: (_, ev) => ev.data.address }),
        assignCaptcha: assign({ captcha: (_, ev) => ev.data.captcha }),
        startLoading: assign({ isLoading: (_) => true }),
        stopLoading: assign({ isLoading: (_) => false }),
        assignError: assign({ error: (_, ev) => ev.data }),
      },
      services: {
        faucet: async ({ address, captcha }) => {
          const response = await fetchFaucet({
            method: "POST",
            body: JSON.stringify({
              address,
              captcha: captcha || "",
            }),
          });
          console.log(`response`, response);

          return true;
        },
      },
    }
  );

export type FaucetMachine = typeof faucetMachine;
export type FaucetMachineState = StateFrom<FaucetMachine>;
