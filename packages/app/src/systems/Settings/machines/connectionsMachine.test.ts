import type { Account, Connection } from '@fuel-wallet/types';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import type { Maybe } from '~/systems/Core';
import { ConnectionService } from '~/systems/DApp/services';

import { mockConnections } from '../__mocks__/connection';

import type {
  ConnectionsMachineService,
  MachineContext,
} from './connectionsMachine';
import { connectionsMachine } from './connectionsMachine';

const setOriginFn = jest.fn();
const removeOriginFn = jest.fn();

function createMachine(context: Partial<MachineContext> = {}) {
  return connectionsMachine.withContext({ inputs: {}, ...context }).withConfig({
    actions: {
      setOriginParam: setOriginFn,
      removeOriginParam: removeOriginFn,
    },
  });
}

describe('connectionsMachine', () => {
  let service: ConnectionsMachineService;
  let conn1: Maybe<Connection>;
  let conn2: Maybe<Connection>;
  let acc1: Maybe<Account>;
  let acc2: Maybe<Account>;

  async function mock() {
    const res = await mockConnections();
    conn1 = res.connection1;
    conn2 = res.connection2;
    acc1 = res.account1;
    acc2 = res.account2;
  }

  beforeEach(async () => {
    await mock();
    const machine = createMachine();
    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
  });

  describe('list', () => {
    it('should fetch a list of connection and populate on context', async () => {
      await waitFor(service, (state) => state.matches('idle'));
      const state = service.getSnapshot();
      const connections = state.context.response?.connections;
      expect(connections?.length).toBe(2);
      expect(connections).toContainEqual(conn1);
      expect(connections).toContainEqual(conn2);
    });

    it('should assign a specific connection if has origin param', async () => {
      const fetchFn = jest.spyOn(ConnectionService, 'getConnections');
      const machine = createMachine({ inputs: { origin: 'uniswap.org' } });
      service = interpret(machine).start();
      await waitFor(service, (state) => state.matches('editing'));

      const state = service.getSnapshot();
      const connection = state.context.inputs.connection;
      expect(connection).toEqual(conn1);
      expect(fetchFn).toBeCalled();
    });

    it('should filter a connection when search', async () => {
      await waitFor(service, (state) => state.matches('idle'));
      service.send('SEARCH', { input: 'uniswap' });

      const state = service.getSnapshot();
      const connections = state.context.response?.filteredConnections;
      expect(connections?.length).toBe(1);
      expect(connections).toContainEqual(conn1);
    });

    it('should remove a connection', async () => {
      const removeFn = jest.spyOn(ConnectionService, 'removeConnection');
      await waitFor(service, (state) => state.matches('idle'));
      service.send('REMOVE_CONNECTION', { input: conn1 });
      await waitFor(service, (state) => state.matches('removing'));
      await waitFor(service, (state) => state.matches('idle'));

      const state = service.getSnapshot();
      const connections = state.context.response?.connections;
      expect(connections?.length).toBe(1);
      expect(connections).toContainEqual(conn2);
      expect(removeFn).toBeCalled();
    });
  });

  describe('editing', () => {
    beforeEach(async () => {
      await mock();
      const machine = createMachine({
        inputs: { origin: 'uniswap.org' },
      });
      service = interpret(machine).start();
      await waitFor(service, (state) => state.matches('editing.idle'));
    });

    it('should assign a connection as input', async () => {
      const state = service.getSnapshot();
      const connection = state.context.inputs.connection;
      expect(connection).toEqual(conn1);
    });

    it('should show only accounts not hidden before enter state', async () => {
      const state = service.getSnapshot();
      const accounts = state.context.response?.accounts;
      expect(accounts?.length).toBe(2);
    });

    it('should assign connected accounts when enter editing.idle', async () => {
      const state = service.getSnapshot();
      const connected = state.context.response?.connectedAccounts;
      expect(connected?.length).toBe(1);
      expect(connected?.[0]?.address).toBe(acc1?.address);
    });

    it('should filter an account when search', async () => {
      service.send('SEARCH', { input: 'Account 1' });

      const state = service.getSnapshot();
      const accounts = state.context.response?.filteredAccounts;
      expect(accounts?.length).toBe(1);
    });

    it('should add an account to connection', async () => {
      const addFn = jest.spyOn(ConnectionService, 'addAccountTo');
      let state = service.getSnapshot();
      let connected = state.context.response?.connectedAccounts;
      expect(connected?.length).toBe(1);
      service.send('ADD_ACCOUNT', { input: acc2?.address });
      await waitFor(service, (state) => state.matches('editing.addingAccount'));
      await waitFor(service, (state) => state.matches('editing.idle'));
      expect(addFn).toBeCalled();
      state = service.getSnapshot();
      connected = state.context.response?.connectedAccounts;
      expect(connected?.length).toBe(2);
    });

    it('should remove an account from connection', async () => {
      const machine = createMachine({
        inputs: { origin: 'fuellabs.github.io/swayswap' },
      });
      service = interpret(machine).start();
      await waitFor(service, (state) => state.matches('editing.idle'));
      const removeFn = jest.spyOn(ConnectionService, 'removeAccountFrom');
      let state = service.getSnapshot();
      let connected = state.context.response?.connectedAccounts;
      expect(connected?.length).toBe(2);
      service.send('REMOVE_ACCOUNT', { input: acc1?.address });
      await waitFor(service, (state) =>
        state.matches('editing.removingAccount')
      );
      await waitFor(service, (state) => state.matches('editing.idle'));
      expect(removeFn).toBeCalled();
      state = service.getSnapshot();
      connected = state.context.response?.connectedAccounts;
      expect(connected?.length).toBe(1);
    });

    it('should remove the entire connection when disconnect all accounts', async () => {
      let state = service.getSnapshot();
      let connections = state.context.response?.connections;
      expect(connections?.length).toBe(2);
      service.send('REMOVE_ACCOUNT', { input: acc1?.address });
      await waitFor(service, (state) => state.matches('removing'));
      await waitFor(service, (state) => state.matches('idle'));
      state = service.getSnapshot();
      connections = state.context.response?.connections;
      expect(connections?.length).toBe(1);
    });
  });
});
