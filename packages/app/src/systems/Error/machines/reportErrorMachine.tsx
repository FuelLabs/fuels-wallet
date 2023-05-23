import { ReportErrorFrequency } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ReportErrorService } from '../services';

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
    data: {
      hasErrors: boolean;
      frequency: ReportErrorFrequency;
    };
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
      input?: null;
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
              actions: ['assignCheckForErrors'],
              target: 'idle',
            },
          ],
          onError: {},
        },
      },
      reporting: {
        tags: ['loading'],
        invoke: {
          src: 'reportErrors',
          data: {
            input: (_: ErrorMachineContext, ev: ErrorMachineEvents) => ev.input,
          },
          onDone: {
            target: 'idle',
            actions: ['reload'],
          },
          onError: {
            target: 'idle',
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
      assignCheckForErrors: assign({
        hasErrors: (_, ev) => ev.data.hasErrors,
        frequency: (_, ev) => ev.data.frequency,
      }),
      reload: () => {},
    },
    services: {
      reportErrors: FetchMachine.create<ReportErrorInputs['upload'], void>({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.frequency) {
            throw new Error('Frequency is required');
          }
          const { frequency } = input;
          await ReportErrorService.setReportErrorFrequency(frequency);
          switch (frequency) {
            case ReportErrorFrequency.ALWAYS:
            case ReportErrorFrequency.ONCE:
              await ReportErrorService.reportErrors();
              break;
            default:
              break;
          }
          await ReportErrorService.clearErrors();
        },
      }),
      checkForErrors: FetchMachine.create<
        void,
        MachineServices['checkForErrors']['data']
      >({
        showError: false,
        maxAttempts: 1,
        async fetch() {
          const hasErrors = await ReportErrorService.checkForErrors();
          const frequency = await ReportErrorService.getReportErrorFrequency();
          return {
            hasErrors,
            frequency,
          };
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
