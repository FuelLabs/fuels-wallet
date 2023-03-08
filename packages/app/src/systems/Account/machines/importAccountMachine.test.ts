import { bn } from 'fuels';
import { interpret } from 'xstate';

import { MOCK_ACCOUNTS } from '../__mocks__';
import { AccountService } from '../services';

import type { ImportAccountMachineService } from './importAccountMachine';
import { importAccountMachine } from './importAccountMachine';

import { expectStateMatch } from '~/systems/Core/__tests__/utils';

const MOCK_ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(0),
  balanceSymbol: '$',
  balances: [{ amount: bn(100000), assetId: '0x0000000000' }],
};

const machine = importAccountMachine.withContext({}).withConfig({
  actions: {
    notifyUpdateAccounts() {},
  },
});

describe('importAccountMachine', () => {
  let service: ImportAccountMachineService;

  beforeEach(async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNT });
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
