import type { NetworkData } from '@fuel-wallet/types';
import { Provider } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { store } from '~/systems/Store';

type MachineContext = {
  network?: Partial<NetworkData>;
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
};

type MachineServices = {
  fetchUrlByChainId: {
    data: Partial<NetworkData>;
  };
  saveNetwork: {
    data: Partial<NetworkData>;
  };
};

export type SelectNetworkInputs = {
  start: {
    network: Partial<NetworkData>;
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
          START: [
            {
              actions: ['assignStartData'],
              target: 'fetchingUrlByChainId',
              cond: 'hasOnlyChainId',
            },
            {
              actions: ['assignStartData'],
              target: 'reviewNetwork',
            },
          ],
        },
      },
      fetchingUrlByChainId: {
        tags: ['loading'],
        invoke: {
          src: 'fetchUrlByChainId',
          data: {
            input: (ctx: MachineContext) => ({
              data: ctx.network,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
            },
            {
              actions: ['assignNetworkUrl'],
              target: 'reviewNetwork',
            },
          ],
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
      assignNetworkUrl: assign({
        network: (ctx, ev) => ({
          ...ctx.network,
          url: ev.data.url,
        }),
      }),
      notifyRefreshNetworks: () => {
        store.refreshNetworks();
      },
      notifyUpdateAccounts: () => {
        store.updateAccounts();
      },
    },
    services: {
      fetchUrlByChainId: FetchMachine.create<
        MachineServices['saveNetwork'],
        NetworkData
      >({
        showError: false,
        async fetch({ input }) {
          if (typeof input?.data?.chainId !== 'number') {
            throw new Error('chainId is required');
          }

          const networkByChainId = await NetworkService.getNetworkByChainId({
            chainId: input.data.chainId,
          });

          if (!networkByChainId) {
            throw new Error('Network not found by chainId');
          }

          return networkByChainId;
        },
      }),
      saveNetwork: FetchMachine.create<
        MachineServices['saveNetwork'],
        NetworkData
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data.url) {
            throw new Error('Missing network URL');
          }

          // If network exists in our database, we can select it
          const hasNetworkByUrl = await NetworkService.getNetworkByUrl({
            url: input.data.url,
          });
          if (hasNetworkByUrl?.id) {
            return NetworkService.selectNetwork({ id: hasNetworkByUrl.id });
          }

          // We can still add it if it's still a valid URL
          const provider = await Provider.create(input.data.url);
          const url = provider.url;
          const name = provider.getChain().name;
          const chainId = await provider.getChainId();

          await NetworkService.validateNetworkVersion({
            url: input.data.url,
          });

          const createdNetwork = await NetworkService.addNetwork({
            data: {
              name,
              url,
              chainId,
            },
          });

          return NetworkService.selectNetwork({ id: createdNetwork.id! });
        },
      }),
    },
    guards: {
      hasOnlyChainId: (_ctx, ev) => {
        const { chainId, url } = ev.input.network;
        return Boolean(typeof chainId === 'number' && !url);
      },
    },
  }
);

export type SelectNetworkRequestMachine = typeof selectNetworkRequestMachine;
export type SelectNetworkRequestMachineService =
  InterpreterFrom<SelectNetworkRequestMachine>;
export type SelectNetworkRequestMachineState =
  StateFrom<SelectNetworkRequestMachine>;
