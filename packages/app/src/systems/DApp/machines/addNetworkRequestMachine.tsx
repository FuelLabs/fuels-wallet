import type { Network } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { NetworkInputs } from '~/systems/Network';
import { NetworkService } from '~/systems/Network';

type MachineContext = {
  network?: Network;
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
};

type MachineServices = {
  saveNetwork: {
    data: Network;
  };
};

export type AddNetworkInputs = {
  start: {
    origin: string;
    network: Network;
    favIconUrl?: string;
    title?: string;
  };
};

type MachineEvents =
  | {
      type: 'START';
      input: AddNetworkInputs['start'];
    }
  | { type: 'APPROVE'; input: void }
  | { type: 'REJECT'; input: void };

export const addNetworkRequestMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./addNetworkRequestMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START: {
            actions: ['assignStartData'],
            target: 'reviewNetwork',
          },
        },
      },
      reviewNetwork: {
        on: {
          APPROVE: {
            target: 'addingNetwork',
          },
          REJECT: {
            actions: [assignErrorMessage('Rejected request!')],
            target: 'failed',
          },
        },
      },
      addingNetwork: {
        invoke: {
          src: 'saveNetwork',
          data: {
            input: (ctx: MachineContext) => ({
              data: ctx.network,
            }),
          },
          onDone: [
            FetchMachine.errorState('failed'),
            {
              target: 'done',
            },
          ],
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {
      assignStartData: assign((ctx, ev) => ({
        ...ctx,
        origin: ev.input.origin,
        title: ev.input.title,
        favIconUrl: ev.input.favIconUrl,
        network: ev.input.network,
      })),
    },
    services: {
      saveNetwork: FetchMachine.create<
        NetworkInputs['addNetwork'],
        MachineServices['saveNetwork']['data']
      >({
        showError: true,
        async fetch({ input }) {
          try {
            if (!input?.data) {
              throw new Error('Invalid network');
            }
            let network = await NetworkService.addNetwork(input);
            if (!network) {
              throw new Error('Failed to add network');
            }
            network = await NetworkService.selectNetwork({ id: network.id! });
            return network as Network;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error?.message.includes('uniqueness')) {
              throw new Error('This network Name or URL already exists');
            }
            throw error;
          }
        },
      }),
    },
  }
);

export type AddNetworkMachine = typeof addNetworkRequestMachine;
export type AddNetworkMachineService = InterpreterFrom<
  typeof addNetworkRequestMachine
>;
export type AddNetworkMachineState = StateFrom<typeof addNetworkRequestMachine>;
