import type { AbiMap } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AbiService } from '../services';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  abiMap?: AbiMap;
};

type MachineServices = {
  fetchAbis: {
    data: AbiMap;
  };
};

type MachineEvents = { type: 'REFRESH_ABIS' };

export const abiMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./abiMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'fetchingAbis',
    states: {
      fetchingAbis: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAbis',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignAbis'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          REFRESH_ABIS: {
            target: 'fetchingAbis',
          },
        },
      },
    },
  },
  {
    actions: {
      assignAbis: assign({
        abiMap: (_, ev) => ev.data,
      }),
    },
    services: {
      fetchAbis: FetchMachine.create<null, AbiMap>({
        showError: true,
        async fetch() {
          return AbiService.getAbiMap();
        },
      }),
    },
  }
);

export type AbisMachine = typeof abiMachine;
export type AbisMachineState = StateFrom<AbisMachine>;
export type AbisMachineService = InterpreterFrom<AbisMachine>;
