import { Wallet } from '@fuel-ts/wallet';
import { WalletManager } from '@fuel-ts/wallet-manager';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';

import { unlockMachine } from './unlockMachine';

import { MOCK_ACCOUNTS } from '~/systems/Account/__mocks__/accounts';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

type Service = InterpreterFrom<typeof unlockMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;

describe('unlockMachine', () => {
  let service: Service;
  const account = MOCK_ACCOUNTS[0];
  const wallet = Wallet.fromPrivateKey(OWNER);

  beforeEach(async () => {
    service = interpret(
      unlockMachine.withContext({}).withConfig({
        services: {
          unlock: () => Promise.resolve(wallet),
          unlockVault: () => Promise.resolve(new WalletManager()),
        },
      })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should unlock wallet', async () => {
    await expectStateMatch(service, 'waitingPassword');
    service.send('UNLOCK_WALLET', {
      input: {
        password: 'qwe123',
        account,
      },
    });
    await expectStateMatch(service, 'unlocking');
    await expectStateMatch(service, 'done');
  });

  it('should unlock vault', async () => {
    await expectStateMatch(service, 'waitingPassword');
    service.send({
      type: 'UNLOCK_VAULT',
      input: {
        password: 'qwe123',
      },
    });
    await expectStateMatch(service, 'unlockingVault');
    await expectStateMatch(service, 'done');
  });
});
