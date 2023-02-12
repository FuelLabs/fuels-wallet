import { hashMessage, Signer } from 'fuels';
import { interpret } from 'xstate';

import type { MessageRequestService } from './signMachine';
import { messageRequestMachine } from './signMachine';

import type { MockVaultData } from '~/systems/Core/__tests__';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__';

describe('signMachine', () => {
  let data: MockVaultData;
  let service: MessageRequestService;

  beforeAll(async () => {
    data = await mockVault();
  });

  beforeEach(async () => {
    service = interpret(messageRequestMachine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should sign message', async () => {
    const DATA = {
      origin: 'foo.com',
      message: 'test message',
      address: data.account.address.toString(),
    };
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: DATA,
    });

    await expectStateMatch(service, 'reviewMessage');

    service.send('SIGN_MESSAGE');

    await expectStateMatch(service, 'signingMessage');
    const { context } = await expectStateMatch(service, 'done');
    const recoveredAddress = Signer.recoverAddress(
      hashMessage(DATA.message),
      context.signedMessage!
    );
    expect(context.origin).toEqual(DATA.origin);
    expect(context.message).toEqual(DATA.message);
    expect(recoveredAddress.toString()).toEqual(context.address);
  });

  it('should reject sign message', async () => {
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        origin: 'foo.com',
        message: 'test message',
        address: data.account.address.toString(),
      },
    });

    await expectStateMatch(service, 'reviewMessage');

    service.send('REJECT');

    const state = await expectStateMatch(service, 'failed');

    expect(state.context.error).toBeTruthy();
  });
});
