import type { Connection } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { ConnectionService } from '../services';

import type { FetchResponse } from '~/systems/Core';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';

type MachineContext = {
  origin?: string;
  originTitle?: string;
  faviconUrl?: string;
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

export type ConnectRequestInputs = {
  start: {
    origin: string;
    originTitle?: string;
    faviconUrl?: string;
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
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
    },
    states: {
      idle: {
        on: {
          START: {
            actions: ['setOrigin'],
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
        origin: (_, ev) => ev.input.origin,
        originTitle: (_, ev) => ev.input.originTitle,
        faviconUrl: (_, ev) => ev.input.faviconUrl,
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

export type ConnectRequestMachine = typeof connectRequestMachine;
export type ConnectRequestService = InterpreterFrom<ConnectRequestMachine>;
export type ConnectRequestState = StateFrom<ConnectRequestMachine>;
