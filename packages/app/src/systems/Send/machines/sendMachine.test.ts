import { Address, bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { MOCK_ASSETS } from '~/systems/Asset/__mocks__/assets';
import type { MockVaultData } from '~/systems/Core/__tests__';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__';

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
        .withConfig({ actions: { goToHome, callTransactionRequest } })
    ).start();
  });

  afterEach(() => {
    service.stop();
    jest.clearAllMocks();
  });

  it('should trigger go home on idle BACK event', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    service.send('BACK');
    expect(goToHome).toHaveBeenCalled();
  });

  it('should create a transaction and calculate the fee', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    service.send('SET_DATA', { input: MOCK_INPUTS });
    await expectStateMatch(service, 'readyToSend');
    service.send('CONFIRM');
    expect(callTransactionRequest).toHaveBeenCalled();
  });
});
