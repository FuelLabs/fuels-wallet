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
  selectedAddresses?: string[];
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
  | { type: 'TOGGLE_ADDRESS'; input: string }
  | { type: 'AUTHORIZE' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
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
      idle: {
        on: {
          CONNECT: {
            actions: ['setOrigin'],
            target: 'connecting',
          },
        },
        after: {
          /** connection should start quickly, if not, it's probably an error or reloading.
           * to avoid stuck black screen, should close the window and let user retry */
          TIMEOUT: '#(machine).closing', // retry
        },
      },
      closing: {
        entry: ['closeWindow'],
        always: {
          target: '#(machine).failed',
        },
      },
      connecting: {
        initial: 'fetchAuthorizedConnection',
        states: {
          selectingAccounts: {
            on: {
              TOGGLE_ADDRESS: {
                actions: ['toggleAddress'],
              },
              NEXT: {
                target: 'authorizing',
              },
            },
          },
          authorizing: {
            on: {
              AUTHORIZE: {
                target: 'authorizeApp',
              },
              BACK: {
                target: 'selectingAccounts',
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
                  target: 'selectingAccounts',
                },
              ],
            },
          },
          authorizeApp: {
            invoke: {
              src: 'addConnection',
              data: {
                input: (ctx: MachineContext) => ({
                  origin: ctx.origin!,
                  accounts: ctx.selectedAddresses,
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
      done: {
        type: 'final',
      },
      failed: {},
    },
    on: {
      REJECT: {
        actions: [assignErrorMessage('Connection rejected!')],
        target: '#(machine).failed',
      },
    },
  },
  {
    delays: { TIMEOUT: 1300 },
    actions: {
      setOrigin: assign({
        origin: (_, ev) => ev.input,
      }),
      setConnected: assign({
        isConnected: (_) => true,
        connection: (_, ev) => ev.data,
      }),
      toggleAddress: assign({
        selectedAddresses: (ctx, ev) => {
          const { selectedAddresses = [] } = ctx;
          const { input } = ev;
          if (selectedAddresses.includes(input)) {
            return selectedAddresses.filter((a) => a !== input);
          }
          return [...selectedAddresses, input];
        },
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
