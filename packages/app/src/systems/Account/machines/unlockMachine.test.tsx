import type { Account } from '@fuel-wallet/types';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';

import { unlockMachine } from './unlockMachine';

import { createMockAccount } from '~/systems/Account/__mocks__/accounts';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';
import { NetworkService } from '~/systems/Network';

type Service = InterpreterFrom<typeof unlockMachine>;

describe('unlockMachine', () => {
  let service: Service;
  let account: Account;
  let password: string;
  const onSuccess = jest.fn();
  const onCancel = jest.fn();

  beforeEach(async () => {
    await NetworkService.clearNetworks();
    await NetworkService.addFirstNetwork();
    const res = await createMockAccount();
    account = res.account!;
    password = res.password;
    service = interpret(unlockMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
    jest.clearAllMocks();
  });

  it('should cancel unlock', async () => {
    service.send('OPEN_UNLOCK', { input: { onSuccess, onCancel } });
    await expectStateMatch(service, 'waitingPassword');
    service.send('CLOSE_UNLOCK');
    await expectStateMatch(service, 'closed');
    expect(onCancel).toBeCalled();
  });

  it('should unlock wallet', async () => {
    service.send('OPEN_UNLOCK', { input: { onSuccess } });
    await expectStateMatch(service, 'waitingPassword');
    service.send('UNLOCK', { input: { account, password } });
    const state = await expectStateMatch(service, 'unlocked');
    const ctx = state.context;
    expect(ctx.response?.wallet).toBeDefined();
    expect(ctx.response?.manager).toBeDefined();
    expect(onSuccess).toBeCalled();
  });
});
