import { toast } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';

import { store } from '~/store';
import type { AssetInputs } from '../services';
import { AssetService } from '../services';

export enum AssetsStatus {
  loading = 'loading',
  isEmpty = 'isEmpty',
  idle = 'idle',
  removing = 'removing',
}

export type MachineContext = {
  assets?: AssetData[];
};

type MachineServices = {
  fetchAssets: {
    data: AssetData[];
  };
  addAsset: {
    data: boolean;
  };
  updateAsset: {
    data: boolean;
  };
  removeAsset: {
    data: boolean;
  };
  setListedAssets: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
};

type MachineEvents =
  | { type: 'ADD_ASSET'; input: AssetInputs['addAsset'] }
  | { type: 'UPDATE_ASSET'; input: AssetInputs['updateAsset'] }
  | { type: 'REMOVE_ASSET'; input: AssetInputs['removeAsset'] }
  | { type: 'RELOAD_LISTED_ASSETS'; input?: never }
  | { type: 'CANCEL'; input?: null };

export const assetsMachine = createMachine(
  {
    predictableActionArguments: true,

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
          ADD_ASSET: {
            target: 'adding',
          },
          UPDATE_ASSET: {
            target: 'updating',
          },
          REMOVE_ASSET: {
            target: 'removing',
          },
          RELOAD_LISTED_ASSETS: {
            target: 'settingListedAssets',
          },
        },
      },
      updating: {
        tags: ['loading'],
        invoke: {
          src: 'updateAsset',
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
                'notifyUpdateAccounts',
                'updateSuccess',
                'navigateBack',
              ],
              target: 'fetchingAssets',
            },
          ],
        },
      },
      adding: {
        tags: ['loading'],
        invoke: {
          src: 'addAsset',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['notifyUpdateAccounts', 'addSuccess', 'navigateBack'],
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
              actions: ['notifyUpdateAccounts', 'removeSuccess'],
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
      updateSuccess: () => {
        toast.success('Asset updated successfully');
      },
      addSuccess: () => {
        toast.success('Asset added successfully');
      },
      notifyUpdateAccounts: () => {
        store.refreshAccounts({ skipLoading: true });
      },
    },
    services: {
      setListedAssets: FetchMachine.create<null, void>({
        showError: true,
        async fetch() {
          await AssetService.setListedAssets();
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
      addAsset: FetchMachine.create<
        AssetInputs['addAsset'],
        MachineServices['addAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data) {
            throw new Error('Missing data');
          }

          await AssetService.addAsset({ data: input.data });
          return true;
        },
      }),
      updateAsset: FetchMachine.create<
        AssetInputs['updateAsset'],
        MachineServices['updateAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.data || !input?.name) {
            throw new Error('Missing data');
          }

          await AssetService.updateAsset(input);
          return true;
        },
      }),
      removeAsset: FetchMachine.create<
        AssetInputs['removeAsset'],
        MachineServices['removeAsset']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.name) {
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
