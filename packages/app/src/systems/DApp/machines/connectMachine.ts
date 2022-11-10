import type { Connection } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ConnectionService } from '../services';

import type { FetchResponse } from '~/systems/Core';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';

export type MachineContext = {
  origin?: string;
  connection?: Connection;
  isConnected: boolean;
  error?: string;
};

type MachineServices = {
  removeConnection: {
    data: FetchResponse<boolean>;
  };
  fetchConnection: {
    data: FetchResponse<Connection | undefined>;
  };
  addConnection: {
    data: FetchResponse<Connection | undefined>;
  };
};

export type MachineEvents =
  | { type: 'CONNECT'; input: string }
  | { type: 'DISCONNECT'; input: Connection }
  | { type: 'AUTHORIZE'; input: Array<string> }
  | { type: 'REJECT' };

export const connectMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./connectMachine.typegen').Typegen0,
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
      idle: {},
      connecting: {
        initial: 'fetchAuthorizedConnection',
        states: {
          authorizing: {
            on: {
              AUTHORIZE: {
                target: 'authorizeApp',
              },
              REJECT: {
                actions: [assignErrorMessage('Connection rejected!')],
                target: '#(machine).failed',
              },
            },
          },
          fetchAuthorizedConnection: {
            invoke: {
              src: 'fetchConnection',
              data: {
                input: (ctx: MachineContext) => ({
                  origin: ctx.origin,
                }),
              },
              onDone: [
                FetchMachine.errorState('#(machine).failed'),
                {
                  cond: 'connectionConnected',
                  actions: ['setConnected'],
                  target: '#(machine).done',
                },
                {
                  target: 'authorizing',
                },
              ],
            },
          },
          authorizeApp: {
            invoke: {
              src: 'addConnection',
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
                FetchMachine.errorState('#(machine).failed'),
                {
                  actions: ['setConnected'],
                  target: '#(machine).done',
                },
              ],
            },
          },
        },
      },
      disconnecting: {
        invoke: {
          src: 'removeConnection',
          data: {
            input: (
              _: MachineContext,
              ev: Extract<MachineEvents, { type: 'DISCONNECT' }>
            ) => ev.input,
          },
          onDone: [
            FetchMachine.errorState('failed'),
            {
              actions: 'setDisconnected',
              target: 'done',
            },
          ],
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
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
  {
    actions: {
      setOrigin: assign({
        origin: (_, ev) => ev.input,
      }),
      setConnected: assign({
        isConnected: (_) => true,
        connection: (_, ev) => ev.data,
      }),
      setDisconnected: assign({
        isConnected: (_) => false,
      }),
    },
    services: {
      fetchConnection: FetchMachine.create<
        MachineContext,
        Connection | undefined
      >({
        showError: false,
        fetch: async ({ input }) => {
          if (input?.origin) {
            return ConnectionService.getConnection(input.origin);
          }
          return undefined;
        },
      }),
      addConnection: FetchMachine.create<Connection, Connection | undefined>({
        showError: false,
        fetch: async ({ input }) => {
          if (!input?.origin || !Array.isArray(input?.accounts)) {
            throw new Error('Origin or account not passed');
          }
          return ConnectionService.addConnection({
            data: {
              origin: input.origin,
              accounts: input.accounts,
            },
          });
        },
      }),
      removeConnection: FetchMachine.create<MachineContext, boolean>({
        showError: false,
        fetch: async ({ input }) => {
          await ConnectionService.removeConnection(input?.origin || '');
          return true;
        },
      }),
    },
    guards: {
      connectionConnected: (_, ev) => {
        return !!((ev.data?.accounts.length || 0) >= 1);
      },
    },
  }
);

export type ConnectMachine = typeof connectMachine;
export type ConnectMachineService = InterpreterFrom<ConnectMachine>;
export type ConnectMachineState = StateFrom<ConnectMachine>;
