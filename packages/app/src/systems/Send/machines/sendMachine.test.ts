import { Wallet } from '@fuel-ts/wallet';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import { bn, Provider } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { SendMachineService, SendMachineState } from './sendMachine';
import { sendMachine } from './sendMachine';

import { AccountService } from '~/systems/Account';
import { MOCK_ASSETS } from '~/systems/Asset/__mocks__/assets';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;

describe('sendMachine', () => {
  let context: SendMachineState['context'];
  let service: SendMachineService;
  let wallet: WalletUnlocked;
  const to = Wallet.generate();
  const goToHome = jest.fn();

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    wallet.provider = new Provider(providerUrl);
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

  async function initMachine() {
    service.send('UNLOCK_WALLET', {
      input: {
        account: wallet,
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('idle'));
    service.send('SET_ASSET', { input: MOCK_ASSETS[0] });
    service.send('SET_ADDRESS', { input: to.address.toString() });
    service.send('SET_AMOUNT', { input: bn(10000) });
  }

  it('should create a transaction request before approve', async () => {
    await initMachine();
    context = service.getSnapshot().context;
    expect(context.inputs?.asset?.assetId).toBe(MOCK_ASSETS[0].assetId);
    expect(context.inputs?.address).toBe(to.address.toString());
    expect(context.inputs?.amount).toEqual(bn(10000));

    await waitFor(service, (state) => state.matches('idle.waitingConfirm'));
    context = service.getSnapshot().context;
    expect(context.response?.fee).toBeDefined();
    expect(context.response?.txRequest).toBeDefined();
    expect(context.errors?.txRequestError).toBeUndefined();
  });

  it('should send a transaction after approve', async () => {
    await initMachine();

    await waitFor(service, (state) => state.matches('idle.waitingConfirm'));
    service.send('CONFIRM');

    await waitFor(service, (state) => state.matches('confirming.idle'));
    service.send('CONFIRM');

    await waitFor(service, (state) => state.matches('confirming.success'));
    context = service.getSnapshot().context;
    expect(context.response?.txApprove).toBeDefined();
    expect(context.errors?.txApproveError).toBeUndefined();
    expect(goToHome).toBeCalled();
  });

  it('should cancel/back work correctly', async () => {
    await initMachine();
    await waitFor(service, (state) => state.matches('idle.waitingConfirm'));
    service.send('BACK');
    expect(goToHome).toBeCalled();

    service.send('CONFIRM');
    await waitFor(service, (state) => state.matches('confirming.idle'));

    service.send('BACK');
    await waitFor(service, (state) => state.matches('idle.waitingConfirm'));
    expect(service.getSnapshot().matches('idle.waitingConfirm')).toBe(true);
  });
});
