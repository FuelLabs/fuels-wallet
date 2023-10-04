import { toast } from '@fuel-ui/react';
import { interpret } from 'xstate';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

import { AccountService } from '../services';

import type { ImportAccountMachineService } from './importAccountMachine';
import { importAccountMachine } from './importAccountMachine';

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
    async function importAccount(name: string) {
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
    }

    it('should be able to import from private key', async () => {
      const name = 'Imported Account';
      await importAccount(name);
      const accounts = await AccountService.getAccounts();
      expect(accounts?.[1].name).toBe('Imported Account');
    });

    it('should throw a error if private key is already imported', async () => {
      const spyToast = jest.spyOn(toast, 'error');
      await importAccount('Imported Account');
      await importAccount('Imported Account2');
      expect(spyToast).toBeCalledWith('Account already imported!');
    });
  });
});
