import { Wallet } from '@fuel-ts/wallet';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import { bn, Provider } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { SendMachineService, SendMachineState } from './sendMachine';
import { sendMachine } from './sendMachine';

import { AccountService } from '~/systems/Account';
import { MOCK_ASSETS } from '~/systems/Asset/__mocks__/assets';
import { NetworkService } from '~/systems/Network';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;

const MOCK_INPUTS = {
  asset: MOCK_ASSETS[0],
  address: Wallet.generate().address.toString(),
  amount: bn(10000),
};

describe('sendMachine', () => {
  let context: SendMachineState['context'];
  let service: SendMachineService;
  let wallet: WalletUnlocked;
  const goToHome = jest.fn();

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    wallet.provider = new Provider(providerUrl);
    const acc = {
      name: 'account',
      address: wallet.address.toString(),
      publicKey: wallet.publicKey,
    };
    await AccountService.addAccount({ data: acc });
    await NetworkService.addFirstNetwork();
    jest.spyOn(AccountService, 'unlock').mockResolvedValue(wallet);
  });

  beforeEach(async () => {
    service = interpret(
      sendMachine
        .withContext({ inputs: {}, response: {}, errors: {} })
        .withConfig({ actions: { goToHome } })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should send a transaction after approve', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    service.send('CONFIRM', { input: MOCK_INPUTS });

    await waitFor(service, (state) => state.matches('confirming.idle'));
    service.send('CONFIRM');

    await waitFor(service, (state) => state.matches('confirming.unlocking'));
    service.send('UNLOCK_WALLET', {
      input: {
        account: wallet,
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('confirming.success'));
    context = service.getSnapshot().context;
    expect(context.response?.transactionResponse).toBeDefined();
    expect(context.errors?.txApproveError).toBeUndefined();
    expect(goToHome).toBeCalled();
  });

  it('should cancel/back work correctly', async () => {
    await waitFor(service, (state) => state.matches('idle'));
    service.send('BACK');
    expect(goToHome).toBeCalled();
    service.send('CONFIRM', { input: MOCK_INPUTS });

    await waitFor(service, (state) => state.matches('confirming.idle'));
    service.send('BACK');

    await waitFor(service, (state) => state.matches('idle'));
    expect(service.getSnapshot().matches('idle')).toBe(true);
  });
});
