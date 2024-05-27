import { Address, bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import {
  MOCK_ASSETS,
  MOCK_BASE_ASSET_ID,
} from '~/systems/Asset/__mocks__/assets';
import type { MockVaultData } from '~/systems/Core/__tests__';
import { expectStateMatch, mockVault } from '~/systems/Core/__tests__';
import type { TxInputs } from '~/systems/Transaction/services';

import { sendMachine } from './sendMachine';
import type { SendMachineService } from './sendMachine';

const MOCK_INPUTS: TxInputs['createTransfer'] = {
  to: Address.fromRandom().toString(),
  amount: bn(100),
  assetId: MOCK_BASE_ASSET_ID,
  tip: bn(0),
  gasLimit: bn(1_000_000),
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
    service.send('SET_INPUT', { input: MOCK_INPUTS });
    await expectStateMatch(service, 'readyToSend');
    service.send('CONFIRM');
    expect(callTransactionRequest).toHaveBeenCalled();
  });
});
