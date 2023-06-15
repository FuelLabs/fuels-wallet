/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { Network } from '@fuel-wallet/types';
import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

import { NetworkInputs, NetworkService } from '../services';

import { store } from '~/store';
import type { Maybe, FetchResponse } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  networks?: Network[];
  /**
   * Used as data on network update
   */
  networkId?: string;
  network?: Maybe<Network>;
  error?: unknown;
};

type MachineServices = {
  fetchNetworks: {
    data: FetchResponse<Network[]>;
  };
  addNetwork: {
    data: FetchResponse<Network>;
  };
  updateNetwork: {
    data: FetchResponse<Network>;
  };
  removeNetwork: {
    data: FetchResponse<string>;
  };
  selectNetwork: {
    data: FetchResponse<Network>;
  };
};

type MachineEvents =
  | { type: 'ADD_NETWORK'; input: NetworkInputs['addNetwork'] }
  | { type: 'EDIT_NETWORK'; input: NetworkInputs['editNetwork'] }
  | { type: 'UPDATE_NETWORK'; input: NetworkInputs['updateNetwork'] }
  | { type: 'REMOVE_NETWORK'; input: NetworkInputs['removeNetwork'] }
  | { type: 'SELECT_NETWORK'; input: NetworkInputs['selectNetwork'] };

export const networksMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./networksMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'fetchingNetworks',
    states: {
      fetchingNetworks: {
        tags: ['loading'],
        invoke: {
          src: 'fetchNetworks',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignNetworks', 'assignNetwork'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          ADD_NETWORK: {
            target: 'addingNetwork',
          },
          EDIT_NETWORK: {
            actions: ['assignNetworkId'],
            target: 'fetchingNetworks',
          },
          UPDATE_NETWORK: {
            target: 'updatingNetwork',
          },
          REMOVE_NETWORK: {
            target: 'removingNetwork',
          },
          SELECT_NETWORK: {
            target: 'selectingNetwork',
          },
        },
      },
      addingNetwork: {
        tags: ['loading'],
        invoke: {
          src: 'addNetwork',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingNetworks',
            },
          ],
        },
      },
      updatingNetwork: {
        tags: ['loading'],
        invoke: {
          src: 'updateNetwork',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['redirectToList'],
              target: 'fetchingNetworks',
            },
          ],
        },
      },
      removingNetwork: {
        tags: ['loading'],
        invoke: {
          src: 'removeNetwork',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['redirectToList'],
              target: 'fetchingNetworks',
            },
          ],
        },
      },
      selectingNetwork: {
        invoke: {
          src: 'selectNetwork',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingNetworks',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignNetworkId: assign({
        networkId: (_, ev) => ev.input.id,
      }),
      assignNetworks: assign({
        networks: (_, ev) => ev.data,
      }),
      assignNetwork: assign({
        network: (ctx, ev) =>
          ctx.networkId ? ev.data.find((n) => n.id === ctx.networkId) : null,
      }),
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    services: {
      fetchNetworks: FetchMachine.create<never, Network[]>({
        showError: true,
        async fetch() {
          return NetworkService.getNetworks();
        },
      }),
      addNetwork: FetchMachine.create<NetworkInputs['addNetwork'], Network>({
        showError: true,
        async fetch({ input }) {
          try {
            if (!input?.data) {
              throw new Error('Invalid network input');
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
      updateNetwork: FetchMachine.create<
        NetworkInputs['updateNetwork'],
        Network
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Invalid network input');
          }
          const network = await NetworkService.updateNetwork(input);
          if (!network) {
            throw new Error('Failed to update network');
          }
          return network;
        },
      }),
      removeNetwork: FetchMachine.create<
        NetworkInputs['removeNetwork'],
        string
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.id) {
            throw new Error('Invalid network id');
          }
          const networkId = await NetworkService.removeNetwork(input);
          if (!networkId) {
            throw new Error('Failed to remove network');
          }
          return networkId;
        },
      }),
      selectNetwork: FetchMachine.create<
        NetworkInputs['selectNetwork'],
        Network
      >({
        async fetch({ input }) {
          if (!input?.id) {
            throw new Error('Invalid network id');
          }
          const network = await NetworkService.selectNetwork(input);
          if (!network) {
            throw new Error('Failed to select network');
          }
          return network;
        },
      }),
    },
  }
);

export type NetworksMachine = typeof networksMachine;
export type NetworksMachineService = InterpreterFrom<NetworksMachine>;
export type NetworksMachineState = StateFrom<NetworksMachine>;
