import type { Connection } from '@fuel-wallet/types';
import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { ConnectionsMachineState } from '../machines';
import {
  ConnectionScreen,
  ConnectionStatus,
  connectionsMachine,
} from '../machines';

// ----------------------------------------------------------------------------
// Selectors
// ----------------------------------------------------------------------------

function filteredOrAll<T>(
  all: T[],
  filtered?: T[] | null,
  searchText?: string
) {
  const hasSearch = Boolean(searchText?.length);
  return hasSearch ? filtered : filtered || all;
}

const selectors = {
  inputs(state: ConnectionsMachineState) {
    return {
      ...state.context?.inputs,
      origin: state.context?.inputs?.origin || '',
    };
  },
  accounts({ context }: ConnectionsMachineState) {
    return filteredOrAll(
      context.response?.accounts || [],
      context.response?.filteredAccounts,
      context.inputs.searchText
    );
  },
  connections({ context }: ConnectionsMachineState) {
    return filteredOrAll(
      context.response?.connections || [],
      context.response?.filteredConnections,
      context.inputs.searchText
    );
  },
  connectedAccounts(state: ConnectionsMachineState) {
    return state.context.response?.connectedAccounts || [];
  },
  connection(state: ConnectionsMachineState) {
    return state.context.inputs.connection;
  },
  screen(state: ConnectionsMachineState) {
    return state.matches('editing')
      ? ConnectionScreen.edit
      : ConnectionScreen.list;
  },
  accountToUpdate(state: ConnectionsMachineState) {
    return state.context.inputs.account;
  },
  status(state: ConnectionsMachineState) {
    const isLoading = state.hasTag('loading');
    const accounts = selectors.accounts(state);
    const connections = selectors.connections(state);
    const screen = selectors.screen(state);
    const initialConnections = state.context.response?.connections;
    const noInitialConnections = !isLoading && !initialConnections?.length;
    const noConnections = !isLoading && !connections?.length;
    const noAccounts = !isLoading && !accounts?.length;
    const noResults =
      (screen === ConnectionScreen.list && noConnections) ||
      (screen === ConnectionScreen.edit && noAccounts);

    if (noInitialConnections) return ConnectionStatus.isEmpty;
    if (isLoading) return ConnectionStatus.loading;
    if (noResults) return ConnectionStatus.noResults;
    if (state.matches('removing')) return ConnectionStatus.removing;
    return ConnectionStatus.idle;
  },
  title(state: ConnectionsMachineState) {
    const screen = selectors.screen(state);
    return screen === ConnectionScreen.list
      ? 'Connected Apps'
      : 'Editing Connection';
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
  const accountToUpdate = useSelector(service, selectors.accountToUpdate);
  const screen = useSelector(service, selectors.screen);
  const numConnected = connectedAccounts?.length ?? 0;
  const title = useSelector(service, selectors.title);
  const connStatus = useSelector(service, selectors.status);

  function status(status: keyof typeof ConnectionStatus) {
    return connStatus === ConnectionStatus[status];
  }

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
  function toggleAccount(account: string, isConnected?: boolean) {
    service.send({
      type: isConnected ? 'REMOVE_ACCOUNT' : 'ADD_ACCOUNT',
      input: account,
    });
  }

  return {
    accounts,
    accountToUpdate,
    connectedAccounts,
    connection,
    connections,
    inputs,
    numConnected,
    screen,
    status,
    title,
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
