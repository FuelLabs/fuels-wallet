import type { Account } from '@fuel-wallet/types';
import { Signer, arrayify, hashMessage } from 'fuels';
import type { HashableMessage } from 'fuels';
import type { AnyInterpreter } from 'xstate';
import { interpret } from 'xstate';
import { AccountService } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';
import type { MockVaultData } from '~/systems/Core/__tests__';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__';
import { VaultService } from '~/systems/Vault';

import { messageRequestMachine } from './messageRequestMachine';

describe('messageRequestMachine', () => {
  let vaultData: MockVaultData;
  let service: AnyInterpreter;

  beforeAll(async () => {
    vaultData = await mockVault();
  });

  beforeEach(async () => {
    const machine = messageRequestMachine.withConfig({
      services: {
        signMessage: FetchMachine.create<
          { message: HashableMessage; address: string },
          string
        >({
          showError: true,
          async fetch({ input }) {
            if (!input?.address || !input?.message) {
              throw new Error('Invalid network input');
            }

            let message: HashableMessage;
            if (typeof input.message === 'string') {
              message = input.message;
            } else if (
              typeof input.message === 'object' &&
              input.message.personalSign
            ) {
              const { personalSign } = input.message;
              if (
                typeof personalSign === 'string' &&
                personalSign.startsWith('0x')
              ) {
                message = { personalSign: arrayify(personalSign) };
              } else if (
                typeof personalSign === 'object' &&
                !Array.isArray(personalSign)
              ) {
                const uint8Array = new Uint8Array(Object.values(personalSign));
                message = { personalSign: uint8Array };
              } else {
                message = { personalSign };
              }
            } else {
              message = input.message;
            }

            const result = await VaultService.signMessage({
              message,
              address: input.address,
            });

            return result;
          },
        }),
        fetchAccount: FetchMachine.create<{ address: string }, Account>({
          showError: true,
          async fetch({ input }) {
            if (!input?.address) {
              throw new Error('Missing address');
            }
            return AccountService.fetchAccount({
              address: input.address,
            });
          },
        }),
      },
    });
    service = interpret(machine).start();
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

  it('should sign PersonalSign message', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const signData = {
      origin: 'foo.com',
      message: { personalSign: 'test message' },
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
    const hashedMsg = hashMessage(signData.message);
    const recoveredAddress = Signer.recoverAddress(
      hashedMsg,
      context.signedMessage!
    );
    expect(context.origin).toEqual(signData.origin);
    expect(context.message).toEqual(signData.message);
    expect(recoveredAddress.toString()).toEqual(context.address);
    consoleSpy.mockRestore();
  });

  it('should sign PersonalSign message with Uint8Array', async () => {
    const signData = {
      origin: 'foo.com',
      message: { personalSign: new Uint8Array([1, 2, 3]) },
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
    const hashedMsg = hashMessage(signData.message);
    const recoveredAddress = Signer.recoverAddress(
      hashedMsg,
      context.signedMessage!
    );
    expect(context.origin).toEqual(signData.origin);
    expect(context.message).toEqual(signData.message);
    expect(recoveredAddress.toString()).toEqual(context.address);
  });

  it('should sign PersonalSign message with hex string', async () => {
    const hexString =
      '0x6eca378ab5ed54f3b21c075d39b4c61ab927c049610670214ddeeee90db832e3';
    const signData = {
      origin: 'foo.com',
      message: { personalSign: hexString },
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
    const hashedMsg = hashMessage({ personalSign: arrayify(hexString) });
    const recoveredAddress = Signer.recoverAddress(
      hashedMsg,
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

  it('should fail when signing message with invalid input', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        origin: 'foo.com',
        message: null,
        address: vaultData.account.address.toString(),
      },
    });

    await expectStateMatch(service, 'reviewMessage');

    service.send('SIGN_MESSAGE');

    const state = await expectStateMatch(service, 'failed');
    expect(state.context.error).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('should fail when signing message with missing address', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        origin: 'foo.com',
        message: 'test message',
        address: 'invalid-address',
      },
    });

    // Should transition from idle -> fetchingAccount -> failed
    await expectStateMatch(service, 'fetchingAccount');
    const state = await expectStateMatch(service, 'failed');

    expect(state.context.error).toBe('Missing address');

    consoleSpy.mockRestore();
  });
});
