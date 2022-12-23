import type { Account, Connection } from '@fuel-wallet/types';
import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { ConnectionsMachineState } from '../machines';
import { ConnectionScreen, connectionsMachine } from '../machines';

// ----------------------------------------------------------------------------
// Selectors
// ----------------------------------------------------------------------------

function filteredOrAll<T>(
  state: ConnectionsMachineState,
  entity: 'accounts' | 'connections'
): T {
  const isAccounts = entity === 'accounts';
  const { searchText = '' } = state.context.inputs;
  const hasSearch = Boolean(searchText.length);
  const response = state.context.response || {};
  const all = response?.[isAccounts ? 'accounts' : 'connections'] || [];
  const filteredProp = `filtered${isAccounts ? 'Accounts' : 'Connections'}`;
  const filtered = response?.[filteredProp];
  return hasSearch ? filtered : filtered || all;
}

const selectors = {
  inputs(state: ConnectionsMachineState) {
    return {
      ...state.context?.inputs,
      origin: state.context?.inputs?.origin || '',
    };
  },
  accounts(state: ConnectionsMachineState) {
    return filteredOrAll<Account[]>(state, 'accounts');
  },
  connectedAccounts(state: ConnectionsMachineState) {
    return state.context.response?.connectedAccounts || [];
  },
  connection(state: ConnectionsMachineState) {
    return state.context.inputs.connection;
  },
  connections(state: ConnectionsMachineState) {
    return filteredOrAll<Connection[]>(state, 'connections');
  },
  screen(state: ConnectionsMachineState) {
    return state.matches('editing')
      ? ConnectionScreen.edit
      : ConnectionScreen.list;
  },
  isLoading(state: ConnectionsMachineState) {
    return state.hasTag('loading');
  },
  isRemoving(state: ConnectionsMachineState) {
    return state.matches('removing');
  },
  isUpdatingAccount(state: ConnectionsMachineState) {
    return state.context.inputs.account;
  },
};

// ----------------------------------------------------------------------------
// Main Hook
// ----------------------------------------------------------------------------

export function useConnections() {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const service = useInterpret(() =>
    connectionsMachine
      .withContext({
        inputs: {
          origin: searchQuery.get('origin'),
        },
      })
      .withConfig({
        actions: {
          setOriginParam: (_, ev) => {
            setSearchQuery({ origin: ev.input.origin });
          },
          removeOriginParam: () => {
            setSearchQuery(undefined);
          },
        },
      })
  );

  const navigate = useNavigate();
  const inputs = useSelector(service, selectors.inputs);
  const connection = useSelector(service, selectors.connection);
  const connections = useSelector(service, selectors.connections);
  const accounts = useSelector(service, selectors.accounts);
  const connectedAccounts = useSelector(service, selectors.connectedAccounts);
  const isLoading = useSelector(service, selectors.isLoading);
  const isRemoving = useSelector(service, selectors.isRemoving);
  const isUpdatingAccount = useSelector(service, selectors.isUpdatingAccount);
  const screen = useSelector(service, selectors.screen);

  const numConnected = connectedAccounts?.length ?? 0;
  const noAccounts = !isLoading && !accounts?.length;
  const noConnections = !isLoading && !connections?.length;
  const showConnections = !isLoading && !noConnections;
  const showAccounts = !isLoading && !noAccounts;
  const title = inputs.origin.length ? inputs.origin : 'Connected Apps';

  function search(text: string) {
    service.send({ type: 'SEARCH', input: text });
  }
  function clearSearch() {
    service.send('CLEAR_SEARCH');
  }
  function editConnection(connection: Connection) {
    service.send({ type: 'EDIT_CONNECTION', input: connection });
  }
  function removeConnection(connection: Connection) {
    service.send({ type: 'REMOVE_CONNECTION', input: connection });
  }
  function cancel() {
    if (screen === ConnectionScreen.edit) {
      service.send('CANCEL');
    } else {
      navigate(-1);
    }
  }

  function isConnected(account: string) {
    return connectedAccounts.some((a) => a?.address === account);
  }
  function toggleAccount(account: string, isConnected: boolean) {
    service.send({
      type: isConnected ? 'REMOVE_ACCOUNT' : 'ADD_ACCOUNT',
      input: account,
    });
  }

  return {
    inputs,
    connection,
    connections,
    accounts,
    connectedAccounts,
    screen,
    title,
    noAccounts,
    numConnected,
    noConnections,
    showConnections,
    showAccounts,
    isLoading,
    isRemoving,
    isUpdatingAccount,
    handlers: {
      search,
      clearSearch,
      editConnection,
      removeConnection,
      toggleAccount,
      cancel,
      isConnected,
    },
  };
}
