import type { StoredFuelWalletError } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { db } from '~/systems/Core/utils/database';
import { ErrorProcessorService } from '~/systems/Error/services/ErrorProcessorService';
import { ReportErrorService } from '../services';

export type ErrorMachineContext = {
  hasErrors?: boolean;
  errors?: StoredFuelWalletError[];
  reportErrorService: ReportErrorService;
  errorProcessorService: ErrorProcessorService;
};

type MachineServices = {
  clearErrors: {
    data: Pick<ErrorMachineContext, 'errors' | 'hasErrors'>;
  };
  reportErrors: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  checkForErrors: {
    data: Pick<ErrorMachineContext, 'errors' | 'hasErrors'>;
  };
  saveError: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
  dismissError: {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    data: void;
  };
};

export type ErrorMachineEvents =
  | {
      type: 'REPORT_ERRORS';
    }
  | {
      type: 'CHECK_FOR_ERRORS';
    }
  | {
      type: 'DISMISS_ERRORS';
    }
  | {
      type: 'SAVE_ERROR';
      input: Error;
    }
  | {
      type: 'DISMISS_ERROR';
      input: string; // Id
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
      reportErrorService: new ReportErrorService(),
      errorProcessorService: new ErrorProcessorService(),
    },
    id: '(machine)',
    initial: 'checkForErrors',
    states: {
      idle: {
        invoke: {
          src: () => (sendBack) => {
            let abort = false;
            const handleDBChange = async () => {
              await new Promise((resolve) => setTimeout(resolve, 500));
              if (abort) return;
              sendBack('CHECK_FOR_ERRORS');
            };

            db.errors.hook('creating').subscribe(handleDBChange);
            return () => {
              abort = true;
              db.errors.hook('creating').unsubscribe(handleDBChange);
            };
          },
        },
        on: {
          DISMISS_ERRORS: {
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
          DISMISS_ERROR: {
            target: 'dismissingError',
          },
        },
      },
      cleaning: {
        invoke: {
          src: 'clearErrors',
          onDone: [
            {
              target: 'checkForErrors',
            },
          ],
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
          },
        },
      },
      savingError: {
        invoke: {
          src: 'saveError',
          onDone: {
            target: 'checkForErrors',
          },
        },
      },
      dismissingError: {
        invoke: {
          src: 'dismissError',
          onDone: {
            target: 'checkForErrors',
          },
        },
      },
    },
  },
  {
    actions: {
      assignCheckForErrors: assign({
        hasErrors: (_, ev) => ev.data.hasErrors,
        errors: (_, ev) => ev.data.errors,
      }),
    },
    services: {
      clearErrors: async (context) => {
        await context.reportErrorService.clearErrors();
        return {
          hasErrors: false,
          errors: [],
        };
      },
      reportErrors: async (context) => {
        await context.reportErrorService.reportErrors();
        await context.reportErrorService.clearErrors();
      },
      checkForErrors: async (context) => {
        await context.errorProcessorService.processErrors();
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
      dismissError: async (context, event) => {
        await context.reportErrorService.dismissError(event.input);
      },
    },
  }
);

export type ReportErrorMachine = typeof reportErrorMachine;
export type ReportErrorMachineState = StateFrom<ReportErrorMachine>;
export type ReportErrorMachineService = InterpreterFrom<
  typeof reportErrorMachine
>;
