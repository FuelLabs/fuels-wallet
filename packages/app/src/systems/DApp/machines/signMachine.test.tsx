import type { WalletUnlocked } from 'fuels';
import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { signMachine } from './signMachine';

import { UnlockService } from '~/systems/Account/services/unlock';

type Service = InterpreterFrom<typeof signMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;

describe('signMachine', () => {
  let service: Service;
  let wallet: WalletUnlocked;

  beforeEach(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    jest.spyOn(UnlockService, 'getWalletUnlocked').mockResolvedValue(wallet);
    service = interpret(signMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
    jest.clearAllMocks();
  });

  it('should sign message', async () => {
    const DATA = {
      origin: 'foo.com',
      message: 'test message',
    };
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_SIGN', {
      input: DATA,
    });

    await waitFor(service, (state) => state.matches('reviewMessage'));

    service.send('SIGN_MESSAGE');

    await waitFor(service, (state) => state.matches('signingMessage'));
    const { context } = await waitFor(service, (state) =>
      state.matches('done')
    );
    const signature = await wallet.signMessage(DATA.message);
    expect(context.signedMessage).toEqual(signature);
  });

  it('should reject sign message', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_SIGN', {
      input: {
        origin: 'foo.com',
        message: 'test message',
      },
    });

    await waitFor(service, (state) => state.matches('reviewMessage'));

    service.send('REJECT');

    const state = await waitFor(service, (state) => state.matches('failed'));

    expect(state.context.error).toBeTruthy();
  });
});
