import { interpret } from 'xstate';

import type { ExportVaultMachineService } from './exportVaultMachine';
import { exportVaultMachine } from './exportVaultMachine';

import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

describe('exportAccountMachine', () => {
  let service: ExportVaultMachineService;
  let state: ReturnType<ExportVaultMachineService['getSnapshot']>;
  let phrase: string;
  let pass: string;

  beforeEach(async () => {
    const { mnemonic, password } = await mockVault();
    phrase = mnemonic;
    pass = password;
    service = interpret(exportVaultMachine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
  });

  describe('export vault', () => {
    it('should wait for password', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      expect(state.context.words).toStrictEqual([]);
    });

    it('should be able to export account private key', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      service.send('EXPORT_VAULT', { input: { password: pass } });
      state = await expectStateMatch(service, 'done');
      expect(state.context.words.join(' ')).toBe(phrase);
    });

    it('should fail with incorrect password and be able to try again', async () => {
      state = await expectStateMatch(service, 'waitingPassword');
      service.send('EXPORT_VAULT', { input: { password: `${pass}1` } });
      state = await expectStateMatch(service, 'waitingPassword');
      expect(state.context.error).toBe('Invalid password');
      service.send('EXPORT_VAULT', { input: { password: pass } });
      state = await expectStateMatch(service, 'done');
      expect(state.context.words.join(' ')).toStrictEqual(phrase);
    });
  });
});
