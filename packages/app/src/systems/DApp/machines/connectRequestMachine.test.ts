import { interpret } from 'xstate';
import { MOCK_ACCOUNTS } from '~/systems/Account';
import { expectStateMatch } from '~/systems/Core/__tests__';

import type { ConnectRequestService } from './connectRequestMachine';
import { connectRequestMachine } from './connectRequestMachine';

const totalAccounts = MOCK_ACCOUNTS.filter((acc) => !acc.isHidden).length;

describe('connectRequestMachine', () => {
  let service: ConnectRequestService;
  beforeEach(async () => {
    service = interpret(connectRequestMachine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should reject connection in selectingAccounts stage', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
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
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
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

  it('should add Account 1 connection', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
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

  it('foo.com should have Account 1 connected', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
    });

    const state = await expectStateMatch(
      service,
      'connecting.selectingAccounts'
    );
    expect(state.context.selectedAddresses).toStrictEqual([
      MOCK_ACCOUNTS[0].address,
    ]);
  });

  it('should remove Account 1 and add Account 2 connection', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
    });

    await expectStateMatch(service, 'connecting.selectingAccounts');

    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[1].address,
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

  it('foo.com should have Account 2 connected', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
    });

    const state = await expectStateMatch(
      service,
      'connecting.selectingAccounts'
    );
    expect(state.context.selectedAddresses).toStrictEqual([
      MOCK_ACCOUNTS[1].address,
    ]);
  });

  it('should add all accounts to the connection', async () => {
    await expectStateMatch(service, 'idle');

    service.send({
      type: 'START',
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
    });

    await expectStateMatch(service, 'connecting.selectingAccounts');

    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[0].address,
    });
    service.send({
      type: 'TOGGLE_ADDRESS',
      input: MOCK_ACCOUNTS[3].address,
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
      input: {
        origin: 'foo.com',
        totalAccounts,
      },
    });

    const state = await expectStateMatch(service, 'done');
    expect(state.context.isConnected).toBeTruthy();
  });
});
