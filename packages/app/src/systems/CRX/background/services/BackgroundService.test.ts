import type { Connection } from '@fuel-wallet/types';
import { Address, Wallet } from 'fuels';
import { NetworkService } from '~/systems/Network/services';
import { BackgroundService } from './BackgroundService';
import { PopUpService } from './PopUpService';

const SELECTED_URL = 'https://selected.network/v1/graphql';
const OTHER_URL = 'https://other.network/v1/graphql';

const address = Address.fromDynamicInput(Wallet.generate().address).toString();
const connection = { origin: 'https://dapp.test', accounts: [address] };
const serverParams = {
  origin: 'https://dapp.test',
  title: 'dApp',
  favIconUrl: '',
  connection: connection as unknown as Connection,
};

const popup = {
  signTransaction: jest.fn(async () => 'signed'),
  sendTransaction: jest.fn(async () => 'sent'),
  destroy: jest.fn(),
};

function createService() {
  return Object.create(BackgroundService.prototype) as BackgroundService;
}

describe('BackgroundService transaction network', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest
      .spyOn(NetworkService, 'getSelectedNetwork')
      .mockResolvedValue({ url: SELECTED_URL } as never);
    jest.spyOn(PopUpService, 'open').mockResolvedValue(popup as never);
  });

  it('rejects signTransaction for a network other than the selected one', async () => {
    await expect(
      createService().signTransaction(
        {
          address,
          provider: { url: OTHER_URL },
          transaction: '{}',
        } as never,
        serverParams
      )
    ).rejects.toThrow('is different from the user current network');
    expect(PopUpService.open).not.toHaveBeenCalled();
  });

  it('signs on the selected network when the dApp sends no provider', async () => {
    await createService().signTransaction(
      { address, transaction: '{}' } as never,
      serverParams
    );
    expect(popup.signTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ provider: { url: SELECTED_URL } })
    );
  });

  it.each(['signTransaction', 'sendTransaction'] as const)(
    '%s does not forward a dApp supplied provider cache',
    async (method) => {
      await createService()[method](
        {
          address,
          provider: { url: SELECTED_URL, cache: { forged: true } },
          transaction: '{}',
        } as never,
        serverParams
      );
      expect(popup[method]).toHaveBeenCalledWith(
        expect.objectContaining({ provider: { url: SELECTED_URL } })
      );
    }
  );
});
