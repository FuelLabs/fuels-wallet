import { interpret } from 'xstate';

import type { ExportAccountMachineService } from './exportAccountMachine';
import { exportAccountMachine } from './exportAccountMachine';

import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

describe('exportAccountMachine', () => {
  let service: ExportAccountMachineService;
  let state: ReturnType<ExportAccountMachineService['getSnapshot']>;
  let primary: string;

  beforeEach(async () => {
    const { account, pkey } = await mockVault();
    primary = pkey;
    service = interpret(
      exportAccountMachine.withContext({ address: account.address })
    ).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
  });

  describe('edit', () => {
    it('should be able to export account private key', async () => {
      state = await expectStateMatch(service, 'idle');
      expect(state.context.exportedKey).toBe(primary);
    });
  });
});
