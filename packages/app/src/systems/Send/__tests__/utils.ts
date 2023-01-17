import type { render } from '@fuel-ui/test-utils';
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

export async function selectEthereumAsAsset(opts: ReturnType<typeof render>) {
  await waitFor(() => findAssetSelect());
  const { user, container } = opts;

  const input = screen.getByText('Select one asset');
  expect(input).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(input);
  });

  await waitFor(async () => {
    const etherItem = await screen.findByLabelText(/Ethereum/i);
    expect(etherItem).toBeInTheDocument();
    await user.press('Enter');
    const trigger = container.querySelector('#fuel_asset-select');
    expect(() => screen.getByText('Select one asset')).toThrow();
    expect(trigger?.textContent?.includes('Ethereum')).toBe(true);
  });
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
