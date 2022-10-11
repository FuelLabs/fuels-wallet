import type { CallResult } from 'fuels';
import { assign, createMachine } from 'xstate';

import type { TxInputs } from '../services';
import { TxService } from '../services';

import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  result?: Maybe<CallResult>;
};

type MachineServices = {
  simulate: {
    data: Maybe<CallResult>;
  };
};

type MachineEvents = {
  type: 'SIMULATE';
  input: TxInputs['simulate'];
};

export const txMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txMachine.typegen').Typegen0,
    id: '(machine)',
    initial: 'idle',
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    states: {
      idle: {
        on: {
          SIMULATE: {
            target: 'simulating',
          },
        },
      },
      simulating: {
        invoke: {
          src: 'simulate',
          data: {
            input: (_ctx: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            { target: 'idle', cond: FetchMachine.hasError },
            { target: 'idle', actions: ['assignData'] },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignData: assign({
        result: (_, ev) => ev.data,
      }),
    },
    services: {
      simulate: FetchMachine.create<TxInputs['simulate'], CallResult>({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Invalid transaction request');
          }
          const result = await TxService.simulate(input);
          return result;
        },
      }),
    },
  }
);
