import { interpret } from 'xstate';

import { AccountService } from '../services';

import type { ImportAccountMachineService } from './importAccountMachine';
import { importAccountMachine } from './importAccountMachine';

import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

const machine = importAccountMachine.withContext({}).withConfig({
  actions: {
    notifyUpdateAccounts() {},
  },
});

describe('importAccountMachine', () => {
  let service: ImportAccountMachineService;

  beforeEach(async () => {
    await mockVault();
    service = interpret(machine).start();
  });

  afterEach(() => {
    service.stop();
  });

  describe('import', () => {
    it('should be able to import from private key', async () => {
      const name = 'Imported Account';

      await expectStateMatch(service, 'idle');
      service.send('IMPORT_ACCOUNT', {
        input: {
          name,
          privateKey:
            '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
        },
      });

      await expectStateMatch(service, 'importingAccount');
      await expectStateMatch(service, 'idle');

      const accounts = await AccountService.getAccounts();
      expect(accounts?.[1].name).toBe(name);
    });
  });
});
