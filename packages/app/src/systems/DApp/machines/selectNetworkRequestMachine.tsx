import type { NetworkData } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { store } from '~/systems/Store';

type MachineContext = {
  network?: Partial<NetworkData>;
  currentNetwork?: NetworkData;
  popup?: 'add' | 'select';
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
};

type MachineServices = {
  saveNetwork: {
    data: Partial<NetworkData>;
    popup: 'add' | 'select';
  };
};

export type SelectNetworkInputs = {
  start: {
    network: Partial<NetworkData>;
    currentNetwork?: NetworkData;
    popup: 'add' | 'select';
    origin: string;
    favIconUrl: string;
    title: string;
  };
};

type MachineEvents =
  | {
      type: 'START';
      input: SelectNetworkInputs['start'];
    }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'APPROVE'; input: void }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'REJECT'; input: void };

export const selectNetworkRequestMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./selectNetworkRequestMachine.typegen').Typegen0,
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
        tags: ['loading'],
        invoke: {
          src: 'saveNetwork',
          data: {
            input: (ctx: MachineContext) => ({
              data: ctx.network,
              popup: ctx.popup,
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
        popup: ev.input.popup,
        network: ev.input.network,
        currentNetwork: ev.input.currentNetwork,
      })),
      notifyRefreshNetworks: () => {
        store.refreshNetworks();
      },
      notifyUpdateAccounts: () => {
        store.refreshAccounts();
      },
    },
    services: {
      saveNetwork: FetchMachine.create<
        MachineServices['saveNetwork'],
        NetworkData
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing input');
          }

          // Selecting existing and inactive network
          if (input.popup === 'select' && input.data.id) {
            return NetworkService.selectNetwork({ id: input.data.id });
          }

          // Adding network
          if (
            input.popup === 'add' &&
            typeof input.data.chainId === 'number' &&
            input.data.name &&
            input.data.url
          ) {
            const createdNetwork = await NetworkService.addNetwork({
              data: {
                chainId: input.data.chainId,
                name: input.data.name,
                url: input.data.url,
              },
            });

            return NetworkService.selectNetwork({ id: createdNetwork.id! });
          }

          throw new Error('Unable to add network');
        },
      }),
    },
  }
);

export type SelectNetworkRequestMachine = typeof selectNetworkRequestMachine;
export type SelectNetworkRequestMachineService =
  InterpreterFrom<SelectNetworkRequestMachine>;
export type SelectNetworkRequestMachineState =
  StateFrom<SelectNetworkRequestMachine>;
