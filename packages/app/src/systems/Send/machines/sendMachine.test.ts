import { Wallet } from '@fuel-ts/wallet';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { Account } from '@fuel-wallet/types';
import { bn, Provider } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { SendMachineService } from './sendMachine';
import { sendMachine } from './sendMachine';

import { AccountService } from '~/systems/Account';
import { MOCK_ASSETS } from '~/systems/Asset/__mocks__/assets';
import { NetworkService } from '~/systems/Network';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;

const MOCK_INPUTS = {
  address: Wallet.generate().address.toString(),
  asset: MOCK_ASSETS[0],
  amount: bn(100),
};

describe('sendMachine', () => {
  let account: Account | undefined;
  let service: SendMachineService;
  let wallet: WalletUnlocked;
  const goToHome = jest.fn();
  const callTransactionRequest = jest.fn();

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    wallet.provider = new Provider(providerUrl);
    const acc = {
      name: 'Account 1',
      address: wallet.address.toString(),
      publicKey: wallet.publicKey,
    };
    account = await AccountService.addAccount({ data: acc });
    if (account) {
      account.isCurrent = true;
      account.balances = MOCK_ASSETS;
      await NetworkService.addFirstNetwork();
    }
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
    const input = { ...MOCK_INPUTS, account, fee };
    service.send('CONFIRM', { input });
    await waitFor(service, (state) => state.matches('confirming'));
    expect(callTransactionRequest).toHaveBeenCalled();
  });
});
