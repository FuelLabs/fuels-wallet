import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ReportErrorService } from '../services';
import { ReportErrorFrequency } from '../types';

import { FetchMachine } from '~/systems/Core';

export type ErrorMachineContext = {
  error?: string;
  hasErrors?: boolean;
  frequency?: ReportErrorFrequency;
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
    frequency: ReportErrorFrequency;
  };
};

export type ErrorMachineEvents =
  | {
      type: 'REPORT_ERRORS';
      input: ReportErrorInputs['upload'];
    }
  | {
      type: 'CHECK_FOR_ERRORS';
    }
  | {
      type: 'DONT_REPORT_ERRORS';
    };

export const reportErrorMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./reportErrorMachine.typegen').Typegen0,
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
            actions: ['assignFrequency'],
          },
          CHECK_FOR_ERRORS: {
            target: 'checkForErrors',
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
            actions: ['resetErrors', 'reload'],
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
    actions: {
      assignFrequency: assign({
        frequency: (_, ev) => ev.input.frequency,
      }),
      resetErrors: assign({
        error: undefined,
      }),
      reload: () => {},
    },
    guards: {
      hasErrors: (_, ev) => ev.data,
    },
    services: {
      async reportErrors({ error }, { input }) {
        console.log({
          error,
          input,
        });
        await ReportErrorService.setReportErrorFrequency(input.frequency);
        switch (input.frequency) {
          case ReportErrorFrequency.ALWAYS:
          case ReportErrorFrequency.ONCE:
            await ReportErrorService.reportErrors();
            break;
          default:
            break;
        }
        await ReportErrorService.clearErrors();
        return true;
      },
      checkForErrors: FetchMachine.create<void, boolean>({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const hasErrors = await ReportErrorService.checkForErrors();
          console.log({ hasErrors });
          return hasErrors;
        },
      }),
    },
  }
);

export type ReportErrorMachine = typeof reportErrorMachine;
export type ReportErrorMachineState = StateFrom<ReportErrorMachine>;
export type ReportErrorMachineService = InterpreterFrom<
  typeof reportErrorMachine
>;
