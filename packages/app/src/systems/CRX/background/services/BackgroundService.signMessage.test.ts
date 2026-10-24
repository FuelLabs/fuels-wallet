import type { Connection } from '@fuel-wallet/types';
import { Address, Wallet } from 'fuels';
import { BackgroundService } from './BackgroundService';
import { PopUpService } from './PopUpService';

const address = Address.fromDynamicInput(Wallet.generate().address).toString();
const serverParams = {
  origin: 'https://dapp.test',
  title: 'dApp',
  favIconUrl: '',
  connection: {
    origin: 'https://dapp.test',
    accounts: [address],
  } as unknown as Connection,
};

const popup = {
  signMessage: jest.fn(async (_input: { message: unknown }) => 'signature'),
  destroy: jest.fn(),
};

function signMessage(message: unknown) {
  const service = Object.create(BackgroundService.prototype);
  return service.signMessage({ address, message }, serverParams);
}

describe('BackgroundService.signMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(PopUpService, 'open').mockResolvedValue(popup as never);
  });

  it('sends bytes given as an object to the popup as one hex string', async () => {
    const personalSign = JSON.parse(
      JSON.stringify(new Uint8Array([65, 66, 67]))
    );
    await signMessage({ personalSign });

    expect(popup.signMessage).toHaveBeenCalledWith(
      expect.objectContaining({ message: { personalSign: '0x414243' } })
    );
  });

  it('keeps string messages as they are', async () => {
    await signMessage('hello');
    await signMessage({ personalSign: '0x414243' });

    expect(popup.signMessage.mock.calls.map(([arg]) => arg.message)).toEqual([
      'hello',
      { personalSign: '0x414243' },
    ]);
  });

  it.each([
    ['keys that are not a byte list', { 0: 65, 1: 66, '-1': 67 }],
    ['a gap in the keys', { 0: 65, 2: 67 }],
    ['a value above 255', { 0: 256 }],
    ['a value that is not an integer', { 0: 1.5 }],
    ['no bytes', {}],
  ])('rejects %s before opening a popup', async (_, personalSign) => {
    await expect(signMessage({ personalSign })).rejects.toThrow(
      'Invalid message'
    );
    expect(PopUpService.open).not.toHaveBeenCalled();
  });
});
