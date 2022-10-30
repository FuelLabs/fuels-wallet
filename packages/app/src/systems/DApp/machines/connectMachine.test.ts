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

  it('should add connection', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    await waitFor(service, (state) => state.matches('connecting.authorizing'));

    service.send({
      type: 'AUTHORIZE',
      input: [MOCK_ACCOUNTS[0].address],
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

  it('should reject connection', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'CONNECT',
      input: 'bar.com',
    });

    await waitFor(service, (state) => state.matches('connecting.authorizing'));

    service.send({
      type: 'REJECT',
    });

    const state = await waitFor(service, (state) => state.matches('failed'));

    expect(state.context.error).toBeTruthy();
  });

  it('should disconnect app', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send({
      type: 'DISCONNECT',
      input: {
        origin: 'foo.com',
        accounts: [MOCK_ACCOUNTS[0].address],
      },
    });

    const state = await waitFor(service, (state) => state.matches('done'));

    // Restart machine
    service.start();

    service.send({
      type: 'CONNECT',
      input: 'foo.com',
    });

    await waitFor(service, (state) => state.matches('connecting.authorizing'));

    expect(state.context.isConnected).toBeFalsy();
  });
});
