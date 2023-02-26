import type { Asset } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AssetInputs } from '~/systems/Asset';
import { AssetService } from '~/systems/Asset';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';

type MachineContext = {
  assets?: Asset[];
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
    data: Asset[];
  };
};

export type AddAssetInputs = {
  start: {
    origin: string;
    asset: Asset[];
    favIconUrl?: string;
    title?: string;
  };
};

export type MachineEvents =
  | {
      type: 'START';
      input: AddAssetInputs['start'];
    }
  | { type: 'ADD_ASSET'; input: void }
  | { type: 'REJECT'; input: void };

export const addAssetRequestMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
          ADD_ASSET: {
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
        { asset: Asset[] },
        MachineServices['filterAssets']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.asset?.length) {
            throw new Error('Invalid assets');
          }

          async function getAssetNotRepeated(
            asset: Asset,
            field: 'name' | 'symbol',
            tries: number = 1
          ): Promise<string | undefined> {
            const repeatedAssets = await AssetService.getAssetsByFilter(
              (a) => a[field]?.trim() === asset[field]?.trim()
            );

            let notRepeatedProp: string | undefined;
            if (repeatedAssets[0]) {
              const nextToTry =
                tries === 1
                  ? `${asset[field]} (${tries})`
                  : `${asset[field]?.slice(0, -4)} (${tries})`;
              notRepeatedProp = await getAssetNotRepeated(
                { ...asset, [field]: nextToTry },
                field,
                tries + 1
              );
            } else {
              notRepeatedProp = asset[field];
            }

            return notRepeatedProp;
          }

          const assetsToAdd = input.asset.reduce(async (prev, asset) => {
            const assets = await prev;
            const name = await getAssetNotRepeated(asset, 'name');
            const symbol = await getAssetNotRepeated(asset, 'symbol');

            return [...assets, { ...asset, name, symbol, isCustom: true }];
          }, Promise.resolve([] as Asset[]));

          return assetsToAdd;
        },
      }),
      saveAsset: FetchMachine.create<
        AssetInputs['bulkAddAsset'],
        MachineServices['saveAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data?.length) {
            throw new Error('Invalid assets');
          }

          return AssetService.bulkAddAsset(input);
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
