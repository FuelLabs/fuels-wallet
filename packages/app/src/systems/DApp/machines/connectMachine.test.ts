import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { ConnectMachineService } from './connectMachine';
import { connectMachine } from './connectMachine';

import { MOCK_ACCOUNTS } from '~/systems/Account';

describe('connectMachine', () => {
  let service: ConnectMachineService;

  beforeEach(async () => {
    service = interpret(connectMachine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should reject connection in selectingAccounts stage', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    await waitFor(service, (state) =>
      state.matches('connecting.selectingAccounts')
    );

    service.send({
      type: 'REJECT',
    });

    const state = await waitFor(service, (state) => state.matches('failed'));

    expect(state.context.error).toBeTruthy();
  });

  it('should reject connection in authorizing stage', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    await waitFor(service, (state) =>
      state.matches('connecting.selectingAccounts')
    );

    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'NEXT',
    });

    await waitFor(service, (state) => state.matches('connecting.authorizing'));

    service.send({
      type: 'REJECT',
    });

    const state = await waitFor(service, (state) => state.matches('failed'));

    expect(state.context.error).toBeTruthy();
  });

  it('should add connection', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    await waitFor(service, (state) =>
      state.matches('connecting.selectingAccounts')
    );
    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'NEXT',
    });

    await waitFor(service, (state) => state.matches('connecting.authorizing'));

    service.send({
      type: 'AUTHORIZE',
    });

    const state = await waitFor(service, (state) => state.matches('done'));
    expect(state.context.isConnected).toBeTruthy();
  });

  it('foo.com should already be connected', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    const state = await waitFor(service, (state) => state.matches('done'));

    expect(state.context.isConnected).toBeTruthy();
  });
});
