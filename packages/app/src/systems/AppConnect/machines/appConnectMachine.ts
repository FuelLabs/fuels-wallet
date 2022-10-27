import type { Application } from '@fuels-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ApplicationService } from '../services';

import type { FetchResponse } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';

export type MachineContext = {
  origin?: string;
  application?: Application;
  isConnected: boolean;
  error?: string;
};

type MachineServices = {
  removeApplication: {
    data: FetchResponse<boolean>;
  };
  fetchApplication: {
    data: FetchResponse<Application | undefined>;
  };
  addApplication: {
    data: FetchResponse<Application | undefined>;
  };
};

export type MachineEvents =
  | { type: 'CONNECT'; input: string }
  | { type: 'DISCONNECT'; input: Application }
  | { type: 'AUTHORIZE'; input: Array<string> }
  | { type: 'REJECT'; input: void };

export const appConnectMachine = createMachine(
  {
    predictableActionArguments: true,
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
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          CONNECT: {
            actions: ['setOrigin'],
            target: 'connecting',
          },
          DISCONNECT: {
            target: 'disconnecting',
          },
        },
      },
      connecting: {
        initial: 'fetchAuthorizedApp',
        states: {
          idle: {},
          fetchAuthorizedApp: {
            invoke: {
              src: 'fetchApplication',
              data: {
                input: (
                  _: MachineContext,
                  ev: Extract<MachineEvents, { type: 'CONNECT' }>
                ) => ev.input,
              },
              onDone: [
                FetchMachine.errorState('#(machine).error'),
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
              data: {
                input: (
                  ctx: MachineContext,
                  ev: Extract<MachineEvents, { type: 'AUTHORIZE' }>
                ) => ({
                  origin: ctx.origin!,
                  accounts: ev.input,
                }),
              },
              onDone: [
                FetchMachine.errorState('#(machine).error'),
                {
                  actions: ['setConnected'],
                  target: '#(machine).connected',
                },
              ],
            },
          },
        },
        on: {
          AUTHORIZE: {
            target: '.authorizeApp',
          },
          REJECT: {
            actions: ['setConnectionRejected'],
            target: '#(machine).error',
          },
        },
      },
      connected: {
        entry: ['closeWindow'],
        on: {
          DISCONNECT: {
            target: 'disconnecting',
          },
        },
      },
      disconnecting: {
        invoke: {
          src: 'removeApplication',
          onDone: [
            FetchMachine.errorState('error'),
            {
              actions: 'setDisconnected',
              target: 'idle',
            },
          ],
        },
      },
      error: {
        entry: ['closeWindow'],
      },
    },
  },
  {
    actions: {
      setConnectionRejected: assign({
        error: (_) => 'Connection rejected!',
      }),
      setOrigin: assign({
        origin: (_, ev) => ev.input,
      }),
      setConnected: assign({
        isConnected: (_) => true,
        application: (_, ev) => ev.data,
      }),
      setDisconnected: assign({
        isConnected: (_) => false,
      }),
      closeWindow: () => {
        // Give time before closing for action respond with error;
        setTimeout(() => {
          window.close();
        }, 100);
      },
    },
    services: {
      fetchApplication: FetchMachine.create<
        MachineContext,
        Application | undefined
      >({
        showError: false,
        fetch: async ({ input }) => {
          if (input?.origin) {
            return ApplicationService.getApplication(input.origin);
          }
          return undefined;
        },
      }),
      addApplication: FetchMachine.create<Application, Application | undefined>(
        {
          showError: false,
          fetch: async ({ input }) => {
            if (!input?.origin || !Array.isArray(input?.accounts)) {
              throw new Error('Origin or account not passed');
            }
            return ApplicationService.addApplication({
              data: {
                origin: input.origin,
                accounts: input.accounts,
              },
            });
          },
        }
      ),
      removeApplication: FetchMachine.create<MachineContext, boolean>({
        showError: false,
        fetch: async ({ input }) => {
          await ApplicationService.removeApplication(input?.origin || '');
          return true;
        },
      }),
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
