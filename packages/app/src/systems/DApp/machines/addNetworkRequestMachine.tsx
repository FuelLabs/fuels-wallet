import type { Network } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { NetworkInputs } from '~/systems/Network';
import { NetworkService } from '~/systems/Network';
import { store } from '~/systems/Store';

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
              actions: ['notifyRefreshNetworks', 'notifyUpdateAccounts'],
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
      notifyRefreshNetworks: () => {
        store.refreshNetworks();
      },
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    services: {
      saveNetwork: FetchMachine.create<
        NetworkInputs['addNetwork'],
        MachineServices['saveNetwork']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Invalid network');
          }
          const createdNetwork = await NetworkService.addNetwork(input);
          if (!createdNetwork) {
            throw new Error('Failed to add network');
          }
          return NetworkService.selectNetwork({ id: createdNetwork.id! });
        },
      }),
    },
  }
);

export type AddNetworkRequestMachine = typeof addNetworkRequestMachine;
export type AddNetworkRequestMachineService = InterpreterFrom<
  typeof addNetworkRequestMachine
>;
export type AddNetworkRequestMachineState = StateFrom<
  typeof addNetworkRequestMachine
>;
