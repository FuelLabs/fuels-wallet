import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ApplicationService } from '../services';
import type { Application } from '../types';

export type MachineContext = {
  application?: Application | null;
  isConnected: boolean;
  error?: string;
};

type MachineServices = {
  removeApplication: {
    data: boolean;
  };
  addApplication: {
    data: Application | null;
  };
  fetchApplication: {
    data: Application | null;
  };
};

export enum ExternalAppEvents {
  connect = 'connect',
  disconnect = 'disconnect',
}

export enum InternalAppEvents {
  authorize = 'authorize',
  reject = 'reject',
}

type MachineEvents =
  | { type: `${ExternalAppEvents.connect}`; data: Application }
  | { type: `${ExternalAppEvents.disconnect}`; data: Application }
  | { type: `${InternalAppEvents.authorize}`; data: Array<string> }
  | { type: `${InternalAppEvents.reject}`; data: void };

export const applicationMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./application.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    context: {
      isConnected: false,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'disconnected',
    states: {
      disconnected: {
        tags: ['emitEvent'],
        on: {
          [ExternalAppEvents.connect]: {
            actions: 'setApplication',
            target: '#(machine).connect',
          },
        },
      },
      connected: {
        tags: ['emitEvent'],
        entry: ['closeTab'],
        on: {
          [ExternalAppEvents.disconnect]: {
            actions: 'setApplication',
            target: '#(machine).disconnect',
          },
        },
      },
      error: {
        tags: ['emitEvent'],
      },
      connect: {
        tags: 'connecting',
        initial: 'fetchAuthorizedApp',
        states: {
          idle: {},
          fetchAuthorizedApp: {
            invoke: {
              src: 'fetchApplication',
              onDone: [
                {
                  cond: 'applicationConnected',
                  actions: ['setConnected'],
                  target: '#(machine).connected',
                },
                {
                  target: 'idle',
                },
              ],
            },
          },
          authorizeApp: {
            invoke: {
              src: 'addApplication',
              onDone: [
                {
                  actions: ['setConnected'],
                  target: '#(machine).connected',
                },
              ],
            },
          },
        },
        on: {
          [InternalAppEvents.authorize]: {
            target: '.authorizeApp',
          },
          [InternalAppEvents.reject]: {
            actions: ['setConnectionRejected'],
            target: '#(machine).error',
          },
        },
      },
      disconnect: {
        invoke: {
          src: 'removeApplication',
          onDone: [
            {
              actions: 'setDisconnected',
              target: 'disconnected',
            },
          ],
        },
        tags: 'disconnecting',
      },
    },
  },
  {
    actions: {
      setConnectionRejected: assign({
        error: (_) => 'Connection rejected!',
      }),
      setApplication: assign({
        application: (_, ev) => {
          return {
            accounts: ev.data.accounts || [],
            origin: ev.data.origin,
          };
        },
      }),
      setConnected: assign({
        isConnected: (_) => true,
        application: (_, ev) => {
          if (ev.data) {
            return ev.data;
          }
          return null;
        },
      }),
      setDisconnected: assign({
        isConnected: (_) => false,
      }),
      closeTab: () => {
        window.close();
      },
    },
    services: {
      fetchApplication: async (ctx, ev) => {
        const app = await ApplicationService.getApplication(ev.data.origin);
        return app || null;
      },
      addApplication: async (ctx, ev) => {
        if (ctx.application && Array.isArray(ev.data)) {
          const app = await ApplicationService.addApplication({
            data: {
              origin: ctx.application.origin,
              accounts: ev.data,
            },
          });
          return app || null;
        }
        return null;
      },
      async removeApplication(_, ev) {
        await ApplicationService.removeApplication(ev.data.origin);
        return true;
      },
    },
    guards: {
      applicationConnected: (_, ev) => {
        return !!((ev.data?.accounts.length || 0) >= 1);
      },
    },
  }
);

export type ApplicationMachine = typeof applicationMachine;
export type ApplicationMachineService = InterpreterFrom<ApplicationMachine>;
export type ApplicationMachineState = StateFrom<ApplicationMachine>;
