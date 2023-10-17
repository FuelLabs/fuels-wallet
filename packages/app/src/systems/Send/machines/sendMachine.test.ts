import { Address, bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { MOCK_ASSETS } from '~/systems/Asset/__mocks__/assets';
import type { MockVaultData } from '~/systems/Core/__tests__';
import { mockVault } from '~/systems/Core/__tests__';

import { sendMachine } from './sendMachine';
import type { SendMachineService } from './sendMachine';

const MOCK_INPUTS = {
  address: Address.fromRandom().toString(),
  asset: MOCK_ASSETS[0],
  amount: bn(100),
};

describe('sendMachine', () => {
  let service: SendMachineService;
  const goToHome = jest.fn();
  const callTransactionRequest = jest.fn();
  let data: MockVaultData;

  beforeAll(async () => {
    data = await mockVault();
    data.account.isCurrent = true;
    data.account.balances = MOCK_ASSETS;
  });

  beforeEach(async () => {
    service = interpret(
      sendMachine
        .withContext({})
        .withConfig({ actions: { goToHome, callTransactionRequest } }),
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should fetch a fake transaction initially', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    const { context } = service.getSnapshot();
    expect(context.fee).toBeDefined();
  });

  it('should trigger go home on idle BACK event', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    service.send('BACK');
    expect(goToHome).toHaveBeenCalled();
  });

  it('should go to invalid state if transaction is invalid', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    const invalidInput = { ...MOCK_INPUTS, address: 'invalid' };
    service.send('CONFIRM', { input: invalidInput });
    await waitFor(service, (state) => state.matches('invalid'));
  });

  it('should create transaction request after confirm', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    const { fee } = service.getSnapshot().context;
    const input = { ...MOCK_INPUTS, account: data.account, fee };
    service.send('CONFIRM', { input });
    await waitFor(service, (state) => state.matches('idle'));
    expect(callTransactionRequest).toHaveBeenCalled();
  });
});
