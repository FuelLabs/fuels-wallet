import { interpret } from 'xstate';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

import type { ExportAccountMachineService } from './exportAccountMachine';
import { exportAccountMachine } from './exportAccountMachine';

describe('exportAccountMachine', () => {
  let service: ExportAccountMachineService;
  let state: ReturnType<ExportAccountMachineService['getSnapshot']>;
  let primary: string;
  let pass: string;

  beforeEach(async () => {
    const { account, pkey, password } = await mockVault();
    primary = pkey;
    pass = password;
    service = interpret(
      exportAccountMachine.withContext({ address: account.address })
    ).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
  });

  describe('edit', () => {
    it('should wait for password', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      expect(state.context.exportedKey).toBe(undefined);
    });

    it('should be able to export account private key', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      service.send('EXPORT_ACCOUNT', { input: { password: pass } });
      state = await expectStateMatch(service, 'idle');
      expect(state.context.exportedKey).toBe(primary);
    });

    it('should fail with incorrect password and be able to try again', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      service.send('EXPORT_ACCOUNT', { input: { password: `${pass}1` } });
      state = await expectStateMatch(service, 'waitingPassword');
      expect(state.context.error).toBe('Invalid password');
      service.send('EXPORT_ACCOUNT', { input: { password: pass } });
      state = await expectStateMatch(service, 'idle');
      expect(state.context.exportedKey).toBe(primary);
    });
  });
});
