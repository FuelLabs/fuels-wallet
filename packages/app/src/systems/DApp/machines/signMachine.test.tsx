import type { WalletUnlocked } from 'fuels';
import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { signMachine } from './signMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

type Service = InterpreterFrom<typeof signMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const WORDS = [
  'strange',
  'purple',
  'adamant',
  'crayons',
  'entice',
  'fun',
  'eloquent',
  'missiles',
  'milk',
  'ice',
  'cream',
  'apple',
];

describe('signMachine', () => {
  let service: Service;
  let wallet: WalletUnlocked;

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    jest.spyOn(AccountService, 'unlock').mockResolvedValue({
      ...wallet,
      exportVault: () => WORDS.join(' '),
    });
  });

  beforeEach(async () => {
    service = interpret(signMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
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

    await waitFor(service, (state) => state.matches('unlocking'));

    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

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
