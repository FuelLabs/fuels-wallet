import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import type { ErrorReportingFrequency } from '../types';

export type ErrorMachineContext = {
  error?: string;
};

type MachineServices = {
  reportErrors: {
    data: boolean;
  };
};

export type ReportErrorInputs = {
  upload: {
    frequency: ErrorReportingFrequency;
  };
};

export type ErrorMachineEvents = {
  type: 'REPORT_ERRORS';
  input: ReportErrorInputs['upload'];
};

export const errorMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./errorMachine.typegen').Typegen0,
    schema: {
      context: {} as ErrorMachineContext,
      services: {} as MachineServices,
      events: {} as ErrorMachineEvents,
    },
    context: {},
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          REPORT_ERRORS: {
            target: 'reporting',
          },
        },
      },
      reporting: {
        tags: ['loading'],
        invoke: {
          src: 'reportErrors',
          onDone: {
            target: 'reported',
            actions: ['resetErrors'],
          },
          onError: {
            target: 'error',
          },
        },
      },
      reported: {
        type: 'final',
      },
      error: {},
    },
  },
  {
    actions: {},
    services: {
      async reportErrors({ error }, { input }) {
        console.log({
          error,
          input,
        });
        return true;
      },
    },
  }
);

export type ErrorMachine = typeof errorMachine;
export type ErrorMachineState = StateFrom<ErrorMachine>;
export type ErrorMachineService = InterpreterFrom<typeof errorMachine>;
