import { toast } from '@fuel-ui/react';
import fetch from 'cross-fetch';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { VITE_FUEL_FAUCET_URL } from '~/config';
import { store } from '~/store';
import type { Maybe } from '~/systems/Core';
import { urlJoin } from '~/systems/Core';

const FAUCET_URL = urlJoin(VITE_FUEL_FAUCET_URL, '/dispense');

async function fetchFaucet(input: RequestInit) {
  const res = await fetch(FAUCET_URL, {
    ...input,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
type MachineEvents = { type: 'START_FAUCET'; data: StartFaucetData };

export const faucetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCGBXAxmALgWVUwAsBLAOzADoSIAbMAYgGUAVAQQCUWB9AMTYCqAYQCiLRKAAOAe1gkcJaWQkgAHogC0AJgAsARkoBWABwBOU3tPHDewwAY9ugDQgAnokuUA7FruGvXgDMejoAbMZmegC+US5oWLgExORU8dgKZFAMEEpU5ABu0gDWqRjpSaQUlGm45FAIBdKYqApKANp2ALoqMnKtykhqmno+RqZa9namdhE6ulou7giBNt7Gen52oVbGOoE6OjFxZYmElaUJGVlgAE430jeUkrQtyA8AttUn+GcpX5d1BpkQrNfodbqDXryRQDUDqBAaFZ2Sh2BzTYwBOaBYwTRaILQYyhYrSmfamGwhUwxWIgMjSCBwFQ1H7JKo0eg9WTQpQqeHaOw6Sh6DGGQzk2zGUJTQx4hFeUwouaGHR2LThLSOLyGI4gZkVP7Muqcvow3maCaGIUq0JeHF6QLBLyhHSykZaSgO3a+RymeWGUI6vW-KpoEj0CDG7mwoYIwIkoWBaWBcJovSywJWIla0I2BwhHSmAM0oOsqg5CiR-pm2O+byhZ2JnQmSzrWX2d0mNV6UIEwIBCaB776iuQrlVwZ8vuC1GWGaYrTY3FuYarAUTT04rz6LRaalRIA */
  createMachine(
    {
      predictableActionArguments: true,
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./faucetMachine.typegen').Typegen0,
      schema: {
        context: {} as MachineContext,
        services: {} as MachineServices,
        events: {} as MachineEvents,
      },
      id: 'faucetMachine',
      initial: 'idle',
      states: {
        idle: {
          on: {
            START_FAUCET: {
              actions: ['assignAddress', 'assignCaptcha'],
              target: 'fauceting',
            },
          },
        },
        fauceting: {
          invoke: {
            src: 'faucet',
            onDone: [
              {
                target: 'done',
              },
            ],
            onError: [
              {
                actions: 'assignError',
                target: 'failed',
              },
            ],
          },
        },
        failed: {
          type: 'final',
        },
        done: {
          entry: ['showDoneFeedback', 'navigateToHome', 'sendFaucetSuccess'],
          type: 'final',
        },
      },
    },
    {
      actions: {
        assignAddress: assign({
          address: (_, ev) => ev.data.address,
        }),
        assignCaptcha: assign({
          captcha: (_, ev) => ev.data.captcha,
        }),
        assignError: assign({
          error: (_, ev) => ev.data,
        }),
        navigateToHome() {},
        sendFaucetSuccess: () => {
          store.updateAccounts();
        },
        showDoneFeedback: () => {
          toast.success('Success, 0.5 ETH was added to your wallet.');
        },
      },
      services: {
        faucet: async ({ address, captcha }) => {
          return fetchFaucet({
            method: 'POST',
            body: JSON.stringify({
              address,
              captcha: captcha || '',
            }),
          });
        },
      },
    }
  );

export type FaucetMachine = typeof faucetMachine;
export type FaucetMachineState = StateFrom<FaucetMachine>;
export type FaucetMachineService = InterpreterFrom<FaucetMachine>;
