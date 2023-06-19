import type { FuelWalletError } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ReportErrorService } from '../services';

import { FetchMachine } from '~/systems/Core';

export type ErrorMachineContext = {
  error?: string;
  hasErrors?: boolean;
  errors?: FuelWalletError[];
};

type MachineServices = {
  reportErrors: {
    data: boolean;
  };
  checkForErrors: {
    data: {
      hasErrors: boolean;
      errors: FuelWalletError[];
    };
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
          IGNORE_ERRORS: {
            target: 'idle',
            actions: ['clearErrors', 'reload'],
          },
          REPORT_ERRORS: {
            target: 'reporting',
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
      assignCheckForErrors: assign({
        hasErrors: (_, ev) => ev.data.hasErrors,
        errors: (_, ev) => ev.data.errors,
      }),
      clearErrors: () => {
        ReportErrorService.clearErrors();
      },
      reload: () => {},
    },
    services: {
      reportErrors: FetchMachine.create<void, void>({
        showError: true,
        maxAttempts: 3,
        async fetch() {
          await ReportErrorService.reportErrors();
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
          const errors = await ReportErrorService.getErrors();
          return {
            hasErrors,
            errors,
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
