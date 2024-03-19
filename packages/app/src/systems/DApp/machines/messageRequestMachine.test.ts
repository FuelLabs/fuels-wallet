import { Signer, hashMessage } from 'fuels';
import { interpret } from 'xstate';
import type { MockVaultData } from '~/systems/Core/__tests__';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__';

import type { MessageRequestService } from './messageRequestMachine';
import { messageRequestMachine } from './messageRequestMachine';

describe('messageRequestMachine', () => {
  let vaultData: MockVaultData;
  let service: MessageRequestService;

  beforeAll(async () => {
    vaultData = await mockVault();
  });

  beforeEach(async () => {
    service = interpret(messageRequestMachine).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should sign message', async () => {
    const signData = {
      origin: 'foo.com',
      message: 'test message',
      address: vaultData.account.address.toString(),
    };
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: signData,
    });

    await expectStateMatch(service, 'reviewMessage');

    service.send('SIGN_MESSAGE');

    await expectStateMatch(service, 'signingMessage');
    const { context } = await expectStateMatch(service, 'done');
    const recoveredAddress = Signer.recoverAddress(
      hashMessage(signData.message),
      context.signedMessage!
    );
    expect(context.origin).toEqual(signData.origin);
    expect(context.message).toEqual(signData.message);
    expect(recoveredAddress.toString()).toEqual(context.address);
  });

  it('should reject sign message', async () => {
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        origin: 'foo.com',
        message: 'test message',
        address: vaultData.account.address.toString(),
      },
    });

    await expectStateMatch(service, 'reviewMessage');

    service.send('REJECT');

    const state = await expectStateMatch(service, 'failed');

    expect(state.context.error).toBeTruthy();
  });
});
