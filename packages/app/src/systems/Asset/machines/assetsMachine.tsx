import { toast } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import { ASSETS_LISTED } from 'assets-listed';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AssetInputs } from '../services';
import { AssetService } from '../services';

import { FetchMachine } from '~/systems/Core';

export enum AssetsStatus {
  loading = 'loading',
  isEmpty = 'isEmpty',
  idle = 'idle',
  removing = 'removing',
}

export type MachineContext = {
  assets?: Asset[];
};

type MachineServices = {
  fetchAssets: {
    data: Asset[];
  };
  saveAsset: {
    data: boolean;
  };
  removeAsset: {
    data: boolean;
  };
  setListedAssets: {
    data: void;
  };
};

type MachineEvents =
  | { type: 'UPSERT_ASSET'; input: AssetInputs['upsertAsset'] }
  | { type: 'REMOVE_ASSET'; input: AssetInputs['removeAsset'] }
  | { type: 'CANCEL'; input?: null };

export const assetsMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./assetsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'settingListedAssets',
    states: {
      settingListedAssets: {
        tags: ['loading'],
        invoke: {
          src: 'setListedAssets',
          onDone: [
            {
              target: 'fetchingAssets',
            },
          ],
        },
      },
      fetchingAssets: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAssets',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignAssets'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          UPSERT_ASSET: {
            target: 'saving',
          },
          REMOVE_ASSET: {
            target: 'removing',
          },
        },
      },
      saving: {
        tags: ['loading'],
        invoke: {
          src: 'saveAsset',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['navigateBack'],
              target: 'fetchingAssets',
            },
          ],
        },
      },
      removing: {
        tags: ['loading'],
        invoke: {
          src: 'removeAsset',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['removeSuccess'],
              target: 'fetchingAssets',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignAssets: assign({
        assets: (_, ev) => ev.data,
      }),
      removeSuccess: () => {
        toast.success('Custom Asset removed successfully');
      },
    },
    services: {
      setListedAssets: FetchMachine.create<null, void>({
        showError: true,
        async fetch() {
          await Promise.all(
            ASSETS_LISTED.map((asset) =>
              AssetService.upsertAsset({ data: { ...asset, isCustom: false } })
            )
          );
        },
      }),
      fetchAssets: FetchMachine.create<
        null,
        MachineServices['fetchAssets']['data']
      >({
        showError: true,
        async fetch() {
          return AssetService.getAssets();
        },
      }),
      saveAsset: FetchMachine.create<
        AssetInputs['upsertAsset'],
        MachineServices['saveAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Missing data');
          }
          const currentAsset = await AssetService.getAsset(input.data.assetId);
          if (currentAsset && !currentAsset.isCustom) {
            throw new Error(`It's not allowed to change Listed Assets`);
          }

          await AssetService.upsertAsset({ data: input.data });
          return true;
        },
      }),
      removeAsset: FetchMachine.create<
        AssetInputs['removeAsset'],
        MachineServices['removeAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.assetId) {
            throw new Error('Missing data');
          }

          await AssetService.removeAsset(input);
          return true;
        },
      }),
    },
  }
);

export type AssetsMachine = typeof assetsMachine;
export type AssetsMachineState = StateFrom<AssetsMachine>;
export type AssetsMachineService = InterpreterFrom<AssetsMachine>;
