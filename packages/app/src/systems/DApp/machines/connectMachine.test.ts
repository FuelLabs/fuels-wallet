import { interpret } from 'xstate';

import type { ConnectRequestService } from './connectMachine';
import { connectMachine } from './connectMachine';

import { MOCK_ACCOUNTS } from '~/systems/Account';
import { expectStateMatch } from '~/systems/Core/__tests__';

describe('connectMachine', () => {
  let service: ConnectRequestService;
  beforeEach(async () => {
    service = interpret(connectMachine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should reject connection in selectingAccounts stage', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: 'foo.com',
    });

    await expectStateMatch(service, 'connecting.selectingAccounts');

    service.send({
      type: 'REJECT',
    });

    const state = await expectStateMatch(service, 'failed');
    expect(state.context.error).toBeTruthy();
  });

  it('should reject connection in authorizing stage', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: 'foo.com',
    });

    await expectStateMatch(service, 'connecting.selectingAccounts');

    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'NEXT',
    });

    await expectStateMatch(service, 'connecting.authorizing');

    service.send({
      type: 'REJECT',
    });

    const state = await expectStateMatch(service, 'failed');
    expect(state.context.error).toBeTruthy();
  });

  it('should add connection', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: 'foo.com',
    });

    await expectStateMatch(service, 'connecting.selectingAccounts');

    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'NEXT',
    });

    await expectStateMatch(service, 'connecting.authorizing');

    service.send({
      type: 'AUTHORIZE',
    });

    const state = await expectStateMatch(service, 'done');
    expect(state.context.isConnected).toBeTruthy();
  });

  it('foo.com should already be connected', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: 'foo.com',
    });

    const state = await expectStateMatch(service, 'done');

    expect(state.context.isConnected).toBeTruthy();
  });
});
