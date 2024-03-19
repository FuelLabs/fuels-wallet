import { toast } from '@fuel-ui/react';
import type { Account, Connection } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { AccountService } from '~/systems/Account';
import type { Maybe } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';
import type { ConnectInputs } from '~/systems/DApp/services';
import { ConnectionService } from '~/systems/DApp/services';

export enum ConnectionScreen {
  list = 'list',
  edit = 'edit',
}

export enum ConnectionStatus {
  loading = 'loading',
  isEmpty = 'isEmpty',
  idle = 'idle',
  noResults = 'noResults',
  removing = 'removing',
}

export type MachineContext = {
  inputs: {
    origin?: Maybe<string>;
    searchText?: string;
    account?: Maybe<string>;
    connection?: Connection;
  };
  response?: {
    accounts?: Account[];
    connections?: Connection[];
    filteredConnections?: Maybe<Connection[]>;
    filteredAccounts?: Maybe<Account[]>;
    connectedAccounts?: Maybe<Account>[];
  };
};

type MachineServices = {
  fetchConnections: {
    data: Connection[];
  };
  fetchAccounts: {
    data: Account[];
  };
  addAccount: {
    data: Connection;
  };
  removeAccount: {
    data: Connection;
  };
  removeConnection: {
    data: Connection;
  };
};

type MachineEvents =
  | { type: 'SEARCH'; input: string }
  | { type: 'CLEAR_SEARCH'; input: null }
  | { type: 'EDIT_CONNECTION'; input: Connection }
  | { type: 'ADD_ACCOUNT'; input: string }
  | { type: 'REMOVE_ACCOUNT'; input: string }
  | { type: 'REMOVE_CONNECTION'; input: Connection }
  | { type: 'CANCEL'; input?: null };

type Inputs = {
  addAccount: ConnectInputs['addAccount'];
  removeAccount: ConnectInputs['removeAccount'];
  removeConnection: ConnectInputs['removeConnection'];
};

export const connectionsMachine = createMachine(
  {
    predictableActionArguments: true,

    tsTypes: {} as import('./connectionsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'fetchingConnections',
    states: {
      fetchingConnections: {
        tags: ['loading'],
        invoke: {
          src: 'fetchConnections',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignConnections'],
              target: 'editing',
              cond: 'hasOriginParam',
            },
            {
              actions: ['assignConnections'],
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          SEARCH: {
            actions: ['assignSearchText', 'filterConnections'],
          },
          CLEAR_SEARCH: {
            actions: ['resetSearch'],
          },
          EDIT_CONNECTION: {
            target: 'editing',
            actions: [
              'resetInputs',
              'resetSearch',
              'setOriginParam',
              'assignOrigin',
            ],
          },
          REMOVE_CONNECTION: {
            target: 'removing',
          },
        },
      },
      editing: {
        entry: ['assignConnectionSelected'],
        initial: 'fetchingAccounts',
        states: {
          fetchingAccounts: {
            tags: ['loading'],
            invoke: {
              src: 'fetchAccounts',
              onDone: [
                {
                  target: 'idle',
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignAccounts'],
                  target: 'idle',
                },
              ],
            },
          },
          idle: {
            entry: ['assignConnectedAccounts'],
            on: {
              SEARCH: {
                actions: ['assignSearchText', 'filterAccounts'],
              },
              CLEAR_SEARCH: {
                actions: ['resetSearch'],
              },
              ADD_ACCOUNT: {
                actions: ['assignAccountSelected'],
                target: 'addingAccount',
              },
              REMOVE_ACCOUNT: {
                actions: ['assignAccountSelected'],
                target: 'removingAccount',
              },
              CANCEL: {
                actions: ['removeOriginParam', 'resetInputs', 'resetSearch'],
                target: '#(machine).fetchingConnections',
              },
            },
          },
          addingAccount: {
            invoke: {
              src: 'addAccount',
              data: {
                input: ({ inputs }: MachineContext) => inputs,
              },
              onDone: [
                {
                  target: 'idle',
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['resetAccountSelected', 'updateConnection'],
                  target: 'idle',
                },
              ],
            },
          },
          removingAccount: {
            invoke: {
              src: 'removeAccount',
              data: {
                input: ({ inputs }: MachineContext) => inputs,
              },
              onDone: [
                {
                  target: 'idle',
                  cond: FetchMachine.hasError,
                },
                {
                  target: '#(machine).removing',
                  cond: 'hasNoConnections',
                },
                {
                  actions: ['resetAccountSelected', 'updateConnection'],
                  target: 'idle',
                },
              ],
            },
          },
        },
      },
      removing: {
        invoke: {
          src: 'removeConnection',
          data: {
            input: (ctx: MachineContext, ev: MachineEvents) => {
              return ev.input || ctx.inputs;
            },
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              target: 'idle',
              actions: [
                'removeSuccess',
                'removeFromConnections',
                'resetInputs',
              ],
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      hasOriginParam: (ctx) => {
        return !!ctx.inputs.origin?.length;
      },
      hasNoConnections(_, ev) {
        return !ev.data?.accounts.length;
      },
    },
    actions: {
      resetInputs: assign({ inputs: () => ({}) }),
      resetSearch: assign({
        inputs: ({ inputs }) => ({
          ...inputs,
          searchText: '',
        }),
        response: ({ response }) => ({
          ...response,
          filteredConnections: null,
          filteredAccounts: null,
        }),
      }),
      assignSearchText: assign({
        inputs: ({ inputs }, ev) => ({
          ...inputs,
          searchText: ev.input,
        }),
      }),
      assignOrigin: assign({
        inputs: ({ inputs }, ev) => ({
          ...inputs,
          origin: ev.input.origin,
        }),
      }),
      assignConnections: assign({
        response: ({ response }, ev) => ({
          ...response,
          connections: ev.data,
        }),
      }),
      filterConnections: assign({
        response: ({ response, inputs }) => ({
          ...response,
          filteredConnections: ConnectionService.filterByOrigin(
            response?.connections || [],
            inputs.searchText
          ),
        }),
      }),
      removeFromConnections: assign({
        response: ({ response }, ev) => ({
          ...response,
          connections: ConnectionService.excludeByOrigin(
            response?.connections || [],
            ev.data.origin
          ),
        }),
      }),
      filterAccounts: assign({
        response: ({ response, inputs }) => ({
          ...response,
          filteredAccounts: AccountService.filterByName(
            response?.accounts || [],
            inputs.searchText
          ),
        }),
      }),
      assignConnectionSelected: assign({
        inputs: ({ inputs, response }) => ({
          ...inputs,
          connection: ConnectionService.findByOrigin(
            response?.connections || [],
            inputs.origin || ''
          ),
        }),
      }),
      updateConnection: assign({
        inputs: ({ inputs }, ev) => ({
          ...inputs,
          connection: ev.data,
        }),
      }),
      assignAccounts: assign({
        response: ({ response }, ev) => ({
          ...response,
          accounts: ev.data,
        }),
      }),
      assignAccountSelected: assign({
        inputs: ({ inputs }, ev) => ({
          ...inputs,
          account: ev.input,
        }),
      }),
      resetAccountSelected: assign({
        inputs: ({ inputs }) => ({
          ...inputs,
          account: null,
        }),
      }),
      assignConnectedAccounts: assign({
        response: ({ inputs, response }) => {
          const connectedAccounts = ConnectionService.getConnectedAccounts(
            inputs.connection,
            response?.accounts || []
          );
          return {
            ...response,
            connectedAccounts,
          };
        },
      }),
      removeSuccess: () => {
        toast.success('Connection removed successfully');
      },
    },
    services: {
      fetchConnections: FetchMachine.create<null, Connection[]>({
        showError: true,
        async fetch() {
          return ConnectionService.getConnections();
        },
      }),
      fetchAccounts: FetchMachine.create<null, Account[]>({
        showError: true,
        async fetch() {
          return (await AccountService.getAccounts()).filter(
            ({ isHidden }) => !isHidden
          );
        },
      }),
      removeConnection: FetchMachine.create<
        Inputs['removeConnection'],
        Maybe<Connection>
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.origin) {
            throw new Error('Missing origin');
          }
          const { origin } = input;
          return ConnectionService.removeConnection({ origin });
        },
      }),
      addAccount: FetchMachine.create<Inputs['addAccount'], Maybe<Connection>>({
        showError: true,
        async fetch({ input }) {
          if (!input?.account || !input?.origin) {
            throw new Error('Missing account or origin');
          }
          const { account, origin } = input;
          return ConnectionService.addAccountTo({ origin, account });
        },
      }),
      removeAccount: FetchMachine.create<
        Inputs['removeAccount'],
        Maybe<Connection>
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.account || !input?.origin) {
            throw new Error('Missing account or origin');
          }
          const { account, origin } = input;
          return ConnectionService.removeAccountFrom({ origin, account });
        },
      }),
    },
  }
);

export type ConnectionsMachine = typeof connectionsMachine;
export type ConnectionsMachineState = StateFrom<ConnectionsMachine>;
export type ConnectionsMachineService = InterpreterFrom<ConnectionsMachine>;
