import type { FuelWalletError } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { ReportErrorService } from '../services';

export type ErrorMachineContext = {
  error?: string;
  hasErrors?: boolean;
  errors?: FuelWalletError[];
  reportErrorService: ReportErrorService; // Ensure this is not optional
};

type MachineServices = {
  clearErrors: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  reportErrors: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  checkForErrors: {
    data: {
      hasErrors: boolean;
      errors: FuelWalletError[];
    };
  };
  saveError: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
};

export type ErrorMachineEvents =
  | {
      type: 'REPORT_ERRORS';
      input?: null;
    }
  | {
      type: 'CHECK_FOR_ERRORS';
      input?: null;
    }
  | {
      type: 'IGNORE_ERRORS';
      input?: null;
    }
  | {
      type: 'SAVE_ERROR';
      input: Pick<FuelWalletError, 'error' | 'reactError'>;
    };

export const reportErrorMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./reportErrorMachine.typegen').Typegen0,
    schema: {
      context: {} as ErrorMachineContext,
      services: {} as MachineServices,
      events: {} as ErrorMachineEvents,
    },
    context: {
      reportErrorService: new ReportErrorService(), // Ensure this is initialized
    },
    id: '(machine)',
    initial: 'checkForErrors',
    states: {
      idle: {
        on: {
          IGNORE_ERRORS: {
            target: 'cleaning',
          },
          REPORT_ERRORS: {
            target: 'reporting',
          },
          CHECK_FOR_ERRORS: {
            target: 'checkForErrors',
          },
          SAVE_ERROR: {
            target: 'savingError',
          },
        },
      },
      cleaning: {
        tags: ['loading'],
        invoke: {
          src: 'clearErrors',
          onDone: {
            target: 'idle',
            actions: ['reload'],
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
        },
      },
      reporting: {
        tags: ['loading'],
        invoke: {
          src: 'reportErrors',
          onDone: {
            target: 'checkForErrors',
            actions: ['reload'],
          },
        },
      },
      savingError: {
        invoke: {
          src: 'saveError',
          onDone: {
            target: 'checkForErrors',
            actions: ['reload'],
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
      assignCheckForErrors: assign({
        hasErrors: (_, ev) => ev.data.hasErrors,
        errors: (_, ev) => ev.data.errors,
      }),
      reload: () => {},
    },
    services: {
      clearErrors: async (context) => {
        await context.reportErrorService.clearErrors();
      },
      reportErrors: async (context) => {
        await context.reportErrorService.reportErrors();
        await context.reportErrorService.clearErrors();
      },
      checkForErrors: async (context) => {
        const hasErrors = await context.reportErrorService.checkForErrors();
        const errors = await context.reportErrorService.getErrors();
        return {
          hasErrors,
          errors,
        };
      },
      saveError: async (_, event) => {
        await ReportErrorService.saveError(event.input);
      },
    },
  }
);

export type ReportErrorMachine = typeof reportErrorMachine;
export type ReportErrorMachineState = StateFrom<ReportErrorMachine>;
export type ReportErrorMachineService = InterpreterFrom<
  typeof reportErrorMachine
>;
