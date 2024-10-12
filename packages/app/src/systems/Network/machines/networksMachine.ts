import type { NetworkData } from '@fuel-wallet/types';
import {
  type InterpreterFrom,
  type StateFrom,
  assign,
  createMachine,
} from 'xstate';
import { store } from '~/store';
import type { FetchResponse, Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

import { Provider } from 'fuels';
import { type NetworkInputs, NetworkService } from '../services';

type MachineContext = {
  networks?: NetworkData[];
  /**
   * Used as data on network update
   */
  networkId?: string;
  network?: Maybe<NetworkData>;
  error?: unknown;
  provider?: Promise<Provider | undefined>;
};

export type AddNetworkInput = {
  data: {
    name: string;
    url: string;
  };
};

type MachineServices = {
  fetchNetworks: {
    data: FetchResponse<NetworkData[]>;
  };
  addNetwork: {
    data: FetchResponse<NetworkData>;
  };
  updateNetwork: {
    data: FetchResponse<NetworkData>;
  };
  removeNetwork: {
    data: FetchResponse<string>;
  };
  selectNetwork: {
    data: FetchResponse<NetworkData>;
  };
};

type MachineEvents =
  | { type: 'ADD_NETWORK'; input: AddNetworkInput }
  | { type: 'EDIT_NETWORK'; input: NetworkInputs['editNetwork'] }
  | { type: 'UPDATE_NETWORK'; input: NetworkInputs['updateNetwork'] }
  | { type: 'REMOVE_NETWORK'; input: NetworkInputs['removeNetwork'] }
  | { type: 'SELECT_NETWORK'; input: NetworkInputs['selectNetwork'] }
  | { type: 'REFRESH_NETWORKS'; input?: null };

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
              actions: ['assignNetworks', 'assignNetwork', 'assignProvider'],
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
              actions: [
                'assignNetwork',
                'notifyUpdateAccounts',
                'redirectToHome',
                'assignProvider',
              ],
              target: 'idle',
            },
          ],
        },
      },
    },
    on: {
      REFRESH_NETWORKS: {
        target: 'fetchingNetworks',
      },
    },
  },
  {
    actions: {
      assignNetworkId: assign({
        networkId: (_, ev) => ev.input.id,
      }),
      assignNetworks: assign((_, event) => {
        store.reloadListedAssets();
        return {
          networks: event.data,
        };
      }),
      assignNetwork: assign({
        network: (ctx, ev) => {
          const noChange = ctx.network?.id === ctx.networkId;
          if (noChange && !!ctx.network) return ctx.network;

          const selectById = (n: NetworkData | null) => n?.id === ctx.networkId;
          const selectByIsSelected = (n: NetworkData | null) => !!n?.isSelected;
          const selector = ctx.networkId ? selectById : selectByIsSelected;
          if (typeof ev.data === 'object' && !!ev.data) {
            return (Object.values(ev.data) as Array<NetworkData>).find(
              selector
            );
          }

          return (
            (ev.data as FetchResponse<NetworkData[]>)?.find?.(selector) ?? null
          );
        },
        networks: (ctx) => {
          const selectedId = ctx.network?.id || ctx.networkId;
          return ctx.networks?.map((network) => ({
            ...network,
            isSelected: network.id === selectedId,
          }));
        },
      }),
      assignProvider: assign({
        provider: async (ctx, _ev) => {
          if ((await ctx.provider)?.url === ctx.network?.url) {
            return ctx.provider;
          }

          return ctx.network ? Provider.create(ctx.network.url) : undefined;
        },
      }),
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    services: {
      fetchNetworks: FetchMachine.create<never, NetworkData[]>({
        showError: true,
        async fetch() {
          const networks = await NetworkService.getNetworks();
          return networks;
        },
      }),
      addNetwork: FetchMachine.create<AddNetworkInput, NetworkData>({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Invalid network input');
          }
          await NetworkService.validateNetworkExists(input.data);
          await NetworkService.validateNetworkVersion(input.data);

          const provider = await Provider.create(input.data.url);
          const chainId = provider.getChainId();

          const createdNetwork = await NetworkService.addNetwork({
            data: {
              chainId,
              name: input.data.name,
              url: input.data.url,
            },
          });
          if (!createdNetwork) {
            throw new Error('Failed to add network');
          }
          return NetworkService.selectNetwork({ id: createdNetwork.id! });
        },
      }),
      updateNetwork: FetchMachine.create<
        NetworkInputs['updateNetwork'],
        NetworkData
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
        NetworkData
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
