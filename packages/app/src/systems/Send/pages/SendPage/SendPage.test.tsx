import { act, fireEvent, render, screen, waitFor } from '@fuel-ui/test-utils';
import { Wallet } from 'fuels';

import { sendLoader } from '../../__mocks__/send';
import {
  selectEthereumAsAsset,
  setAddressInput,
  setAmountInput,
} from '../../__tests__/utils';

import { SendPage } from './SendPage';

import { TestWrapper } from '~/systems/Core';

describe('SendPage()', () => {
  const wallet = Wallet.generate();
  const loader = sendLoader(wallet);

  beforeEach(async () => {
    await loader();
  });

  it('should send a transaction', async () => {
    render(<SendPage />, { wrapper: TestWrapper });

    /** Select all transaction info needed */
    await selectEthereumAsAsset();
    await setAddressInput(wallet);
    await setAmountInput('10');

    /** Click on confirm */
    const confirm = await screen.findByText('Confirm');
    expect(confirm.getAttribute('aria-disabled')).toBe('false');
    await act(() => fireEvent.click(confirm));

    /** Click on approve */
    const approve = await screen.findByText('Approve');
    expect(approve).toBeInTheDocument();
    await act(() => fireEvent.click(approve));

    /** Unlock after approve */
    await waitFor(() => screen.findAllByText('Confirm Transaction'));
    const input = await screen.findByLabelText('Your Password');
    fireEvent.input(input, { target: { value: '123123123' } });
    const confirmUnlock = await screen.findByText('Confirm Transaction');
    await act(() => fireEvent.click(confirmUnlock));

    /** See transaction success msg */
    await waitFor(() => screen.findByText('Transaction sent'));
  });
});
