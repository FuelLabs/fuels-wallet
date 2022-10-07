import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import type { Application } from '../types';

type MachineContext = {
  data?: Application;
  error?: unknown;
};

type MachineServices = {
  fetchApplications: {
    data: Application;
  };
};

type MachineEvents =
  | { type: 'CONNECT' }
  | { type: 'DISCONNECTION' }
  | { type: 'IS_CONNECTED' };

export const applicationMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./applicationMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'done',
    states: {
      done: {},
      failed: {},
    },
    on: {
      CONNECT: {
        target: 'done',
      },
      DISCONNECTION: {
        target: 'done',
      },
      IS_CONNECTED: {
        target: 'done',
      },
    },
  },
  {
    actions: {},
    services: {},
    guards: {},
  }
);

export type ApplicationMachine = typeof applicationMachine;
export type ApplicationMachineService = InterpreterFrom<
  typeof applicationMachine
>;
export type ApplicationMachineState = StateFrom<typeof applicationMachine>;
