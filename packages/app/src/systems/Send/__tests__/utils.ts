import { act, fireEvent, screen, waitFor } from '@fuel-ui/test-utils';
import type { WalletUnlocked } from 'fuels';

export function findAssetSelect() {
  return screen.findByLabelText('Select Asset');
}

export async function waitForStatus(status: string) {
  await waitFor(() => {
    return screen.getByTestId(status);
  });
}

export async function selectEthereumAsAsset() {
  let asset = await screen.findByLabelText('Select Asset');
  fireEvent.click(asset);
  const eth = await screen.findByText('Ethereum');
  expect(eth).toBeInTheDocument();
  await act(() => fireEvent.click(eth));
  asset = await findAssetSelect();
  expect(asset.getAttribute('data-value')).toBe('Ethereum');
}

export async function setAddressInput(wallet: WalletUnlocked) {
  const input = await screen.findByLabelText('Address Input');
  fireEvent.input(input, { target: { value: wallet.address.toString() } });
  await waitFor(() => {
    expect(() => screen.getByText('Invalid bech32 address')).toThrow();
  });
}

export async function setAmountInput(amount: string) {
  const input = await screen.findByLabelText('amount');
  await act(() => fireEvent.input(input, { target: { value: amount } }));
  await waitFor(() => {
    expect(input.getAttribute('value')).toBe(amount);
  });
}
