import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import { ReportErrorService } from '../services';
import type { ErrorReportingFrequency } from '../types';

import { FetchMachine } from '~/systems/Core';

export type ErrorMachineContext = {
  error?: string;
  hasErrors?: boolean;
};

type MachineServices = {
  reportErrors: {
    data: boolean;
  };
  checkForErrors: {
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
    initial: 'checkForErrors',
    states: {
      idle: {
        on: {
          REPORT_ERRORS: {
            target: 'reporting',
          },
        },
      },
      checkForErrors: {
        invoke: {
          src: 'checkForErrors',
          onDone: [
            {
              cond: 'hasErrors',
              target: 'idle',
            },
            {
              target: 'reported',
            },
          ],
          onError: {},
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
    guards: {
      hasErrors: (_, ev) => ev.data,
    },
    services: {
      async reportErrors({ error }, { input }) {
        console.log({
          error,
          input,
        });
        return true;
      },
      checkForErrors: FetchMachine.create<void, boolean>({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const hasErrors = await ReportErrorService.checkForErrors();
          return hasErrors;
        },
      }),
    },
  }
);

export type ErrorMachine = typeof errorMachine;
export type ErrorMachineState = StateFrom<ErrorMachine>;
export type ErrorMachineService = InterpreterFrom<typeof errorMachine>;
