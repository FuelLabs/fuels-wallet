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
  selectNextValidNetwork: {
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
              actions: ['reloadAssets', 'assignNetwork', 'assignProvider'],
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
              target: 'fetchingNetworks',
              actions: ['redirectToList'],
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
              target: 'idle',
              actions: [
                'filterNetworks',
                'selectNextValidNetwork',
                'fetchNetworks',
              ],
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
                'selectNetwork',
                'fetchNetworks',
                'notifyUpdateAccounts',
                'redirectToHome',
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
      reloadAssets: assign((ctx, event) => {
        store.reloadListedAssets();
        if (Array.isArray(event.data)) {
          return {
            networks: event.data,
          };
        }
        return {
          networks: ctx.networks,
        };
      }),
      selectNextValidNetwork: assign({
        network: (ctx, ev) => {
          if (ctx?.network && ctx.network.id !== ev.data) {
            return ctx.network;
          }
          const network =
            ctx.networks?.find(({ id }) => id !== ev.data) ?? ctx.networks?.[0];
          return network ? { ...network, isSelected: true } : network;
        },
        networks: (ctx) => {
          return ctx?.networks?.map((data, idx) => ({
            ...data,
            isSelected: idx === 0,
          }));
        },
      }),
      filterNetworks: assign({
        networks: (ctx, ev) => {
          if (!ctx?.network || !ctx?.networks) return ctx.networks;
          return ctx?.networks?.filter(({ id }) => id !== ev.data);
        },
      }),
      selectNetwork: assign({
        network: (ctx, ev) => {
          const network =
            ctx?.networks?.find(({ id }) => id === ev.data.id) ??
            ctx.networks?.[0];
          return network ? { ...network, isSelected: true } : network;
        },
        networks: (ctx, ev) => {
          const networks = Object.values(
            ctx.networks ?? {}
          ) as Array<NetworkData>;
          const networksParsed =
            (ev.data?.id &&
              networks.map((data) => ({
                ...data,
                isSelected: data.id === ev.data.id,
              }))) ||
            [];
          return networksParsed;
        },
      }),
      assignNetwork: assign({
        network: (ctx) => {
          const selectByIsSelected = (n: NetworkData | null) => !!n?.isSelected;
          const network = ctx.networks?.find(selectByIsSelected);
          return network
            ? ({ ...network, isSelected: true } as NetworkData)
            : undefined;
        },
        networks: (ctx) => {
          const selectedId = ctx.network?.id;
          return (
            ctx.networks?.map((n) => ({
              ...n,
              isSelected: n.id === selectedId,
            })) || []
          );
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
