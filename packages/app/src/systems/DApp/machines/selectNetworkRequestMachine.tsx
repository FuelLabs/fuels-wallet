import type { NetworkData } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { store } from '~/systems/Store';

type MachineContext = {
  network?: NetworkData;
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
};

type MachineServices = {
  saveNetwork: {
    data: NetworkData;
  };
};

export type SelectNetworkInputs = {
  start: {
    origin: string;
    network: NetworkData;
    favIconUrl?: string;
    title?: string;
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

          // If url is provided and network exists, we can select it
          const hasNetworkByUrl = await NetworkService.getNetworkByUrl({
            url: input.data.url,
          });
          if (hasNetworkByUrl?.id) {
            return NetworkService.selectNetwork({ id: hasNetworkByUrl.id });
          }

          // If chainId is provided and network exists, we can select it
          if (input.data.id) {
            const networkById = await NetworkService.getNetworkById({
              id: input.data.id,
            });

            if (networkById?.id) {
              return NetworkService.selectNetwork({ id: networkById.id });
            }
          }

          // Otherwise, we can add it if it's still valid
          await NetworkService.validateNetworkVersion(input);
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

export type SelectNetworkRequestMachine = typeof selectNetworkRequestMachine;
export type SelectNetworkRequestMachineService = InterpreterFrom<
  typeof selectNetworkRequestMachine
>;
export type SelectNetworkRequestMachineState = StateFrom<
  typeof selectNetworkRequestMachine
>;
