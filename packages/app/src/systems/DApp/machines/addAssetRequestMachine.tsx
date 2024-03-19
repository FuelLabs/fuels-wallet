import type { AssetData } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import type { AssetInputs } from '~/systems/Asset';
import { AssetService } from '~/systems/Asset';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';

type MachineContext = {
  assets?: AssetData[];
  origin?: string;
  title?: string;
  favIconUrl?: string;
  error?: string;
};

type MachineServices = {
  saveAsset: {
    data: boolean;
  };
  filterAssets: {
    data: AssetData[];
  };
};

export type AddAssetInputs = {
  start: {
    origin: string;
    assets: AssetData[];
    favIconUrl?: string;
    title?: string;
  };
};

type MachineEvents =
  | {
      type: 'START';
      input: AddAssetInputs['start'];
    }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'APPROVE'; input: void }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'REJECT'; input: void };

export const addAssetRequestMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./addAssetRequestMachine.typegen').Typegen0,
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
            target: 'filteringAssets',
          },
        },
      },
      filteringAssets: {
        invoke: {
          src: 'filterAssets',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            FetchMachine.errorState('failed'),
            {
              target: 'reviewAsset',
              actions: ['assignAssets'],
            },
          ],
        },
      },
      reviewAsset: {
        on: {
          APPROVE: {
            target: 'addingAsset',
          },
          REJECT: {
            actions: [assignErrorMessage('Rejected request!')],
            target: 'failed',
          },
        },
      },
      addingAsset: {
        invoke: {
          src: 'saveAsset',
          data: {
            input: (ctx: MachineContext) => ({
              data: ctx.assets,
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
      })),
      assignAssets: assign({
        assets: (_, ev) => ev.data,
      }),
    },
    services: {
      filterAssets: FetchMachine.create<
        AddAssetInputs['start'],
        MachineServices['filterAssets']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.assets?.length) {
            throw new Error('Invalid assets');
          }

          const assetsToAdd = await AssetService.avoidRepeatedFields(
            input.assets
          );
          return assetsToAdd;
        },
      }),
      saveAsset: FetchMachine.create<
        AssetInputs['addAssets'],
        MachineServices['saveAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data?.length) {
            throw new Error('Invalid assets');
          }

          return AssetService.addAssets(input);
        },
      }),
    },
  }
);

export type AddAssetMachine = typeof addAssetRequestMachine;
export type AddAssetMachineService = InterpreterFrom<
  typeof addAssetRequestMachine
>;
export type AddAssetMachineState = StateFrom<typeof addAssetRequestMachine>;
