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
        MachineServices['saveNetwork'],
        NetworkData
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Invalid network');
          }

          // If url is provided
          if (input.data.url) {
            // If network exists in our database, we can select it
            const hasNetworkByUrl = await NetworkService.getNetworkByUrl({
              url: input.data.url,
            });
            if (hasNetworkByUrl?.id) {
              return NetworkService.selectNetwork({ id: hasNetworkByUrl.id });
            }

            // We can still add it if it's still valid
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
          }

          // If chainId is provided and network exists, we can select it
          if (input.data.chainId) {
            const networkByChainId = await NetworkService.getNetworkByChainId({
              chainId: input.data.chainId,
            });

            if (networkByChainId?.id) {
              return NetworkService.selectNetwork({ id: networkByChainId.id });
            }
          }

          // Since we don't have a url or created network by chainId, we can't select a network
          throw new Error('Network not found by chainId');
        },
      }),
    },
  }
);

export type SelectNetworkRequestMachine = typeof selectNetworkRequestMachine;
export type SelectNetworkRequestMachineService = InterpreterFrom<
  typeof selectNetworkRequestMachine
>;
export type SelectNetworkRequestMachineState = StateFrom<
  typeof selectNetworkRequestMachine
>;
