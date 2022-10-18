import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ApplicationService } from '../services';
import type { Application } from '../types';

export type MachineContext = {
  origin?: string;
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

export type MachineEvents =
  | { type: 'connect'; data: string }
  | { type: 'disconnect'; data: Application }
  | { type: 'authorize'; data: Array<string> }
  | { type: 'reject'; data: void };

export const appConnectMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./appConnectMachine.typegen').Typegen0,
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
    initial: 'idle',
    states: {
      idle: {
        on: {
          connect: {
            actions: ['setOrigin'],
            target: '#(machine).connect',
          },
          disconnect: {
            target: '#(machine).disconnect',
          },
        },
      },
      connected: {
        entry: ['closeWindow'],
        on: {
          disconnect: {
            actions: 'setApplication',
            target: '#(machine).idle',
          },
        },
      },
      error: {
        entry: ['closeWindow'],
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
          authorize: {
            target: '.authorizeApp',
          },
          reject: {
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
              target: 'idle',
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
      setOrigin: assign({
        origin: (_, ev) => ev.data,
      }),
      setApplication: assign({
        application: (ctx, ev) => {
          return {
            accounts: ev.data.accounts || [],
            origin: ctx.origin!,
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
      closeWindow: () => {
        window.close();
      },
    },
    services: {
      fetchApplication: async (ctx, ev) => {
        const app = await ApplicationService.getApplication(ev.data);
        return app || null;
      },
      addApplication: async (ctx, ev) => {
        if (ctx.origin && Array.isArray(ev.data)) {
          const app = await ApplicationService.addApplication({
            data: {
              origin: ctx.origin,
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

export type AppConnectMachine = typeof appConnectMachine;
export type AppConnectMachineService = InterpreterFrom<AppConnectMachine>;
export type AppConnectMachineState = StateFrom<AppConnectMachine>;
