import type { Connection } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import type { FetchResponse } from '~/systems/Core';
import { FetchMachine, assignErrorMessage } from '~/systems/Core';

import { ConnectionService } from '../services';

type MachineContext = {
  origin?: string;
  title?: string;
  favIconUrl?: string;
  connection?: Connection;
  isConnected: boolean;
  error?: string;
  selectedAddresses?: string[];
  totalAccounts: number;
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

export type ConnectRequestInputs = {
  start: {
    origin: string;
    title?: string;
    favIconUrl?: string;
    totalAccounts: number;
  };
};

type MachineEvents =
  | { type: 'START'; input: ConnectRequestInputs['start'] }
  | { type: 'TOGGLE_ADDRESS'; input: string }
  | { type: 'AUTHORIZE' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'REJECT' };

export const connectRequestMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./connectRequestMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    context: {
      isConnected: false,
      totalAccounts: 0,
    },
    states: {
      idle: {
        on: {
          START: {
            actions: ['assignData'],
            target: 'connecting',
          },
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
                  actions: ['setConnection'],
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
                  title: ctx.title,
                  favIconUrl: ctx.favIconUrl,
                  connection: ctx.connection,
                  selectedAddresses: ctx.selectedAddresses,
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
      assignData: assign({
        origin: (_, ev) => ev.input.origin,
        title: (_, ev) => ev.input.title,
        favIconUrl: (_, ev) => ev.input.favIconUrl,
        totalAccounts: (_, ev) => ev.input.totalAccounts,
      }),
      setConnected: assign({
        isConnected: (_) => true,
        connection: (_, ev) => ev.data,
      }),
      setConnection: assign({
        connection: (_, ev) => ev.data,
        selectedAddresses: (_, ev) => ev.data?.accounts || [],
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
      addConnection: FetchMachine.create<
        MachineContext,
        Connection | undefined
      >({
        showError: false,
        fetch: async ({ input }) => {
          if (
            !input?.origin ||
            !Array.isArray(input?.selectedAddresses) ||
            input?.selectedAddresses.length === 0
          ) {
            throw new Error('Invalid connect request');
          }
          if (input.connection) {
            return ConnectionService.updateConnectedAccounts({
              origin: input.origin,
              accounts: input.selectedAddresses,
            });
          }
          return ConnectionService.addConnection({
            data: {
              origin: input.origin,
              accounts: input.selectedAddresses,
              favIconUrl: input.favIconUrl,
              title: input.title,
            },
          });
        },
      }),
    },
    guards: {
      connectionConnected: (ctx, ev) => {
        return (
          (ev.data?.accounts.length || 0) === ctx.totalAccounts &&
          ctx.totalAccounts >= 1
        );
      },
    },
  }
);

export type ConnectRequestMachine = typeof connectRequestMachine;
export type ConnectRequestService = InterpreterFrom<ConnectRequestMachine>;
export type ConnectRequestState = StateFrom<ConnectRequestMachine>;
