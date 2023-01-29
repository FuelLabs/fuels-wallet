import { fireEvent, render, screen, waitFor } from '@fuel-ui/test-utils';
import { Wallet } from 'fuels';

import { sendLoader } from '../../__mocks__/send';
import {
  selectEthereumAsAsset,
  setAddressInput,
  setAmountInput,
} from '../../__tests__/utils';

import { SendPage } from './SendPage';

import { TestWrapper } from '~/systems/Core';

describe.skip('SendPage()', () => {
  const wallet = Wallet.generate();
  const loader = sendLoader(wallet);

  beforeEach(async () => {
    await loader();
  });

  it('should send a transaction', async () => {
    const opts = render(<SendPage />, { wrapper: TestWrapper });

    /** Select all transaction info needed */
    await selectEthereumAsAsset(opts);
    await setAddressInput(wallet);
    await setAmountInput('10');

    /** Click on confirm */
    await waitFor(async () => {
      const confirm = screen.getByText('Confirm');
      expect(confirm.getAttribute('aria-disabled')).toBe('false');
      fireEvent.click(confirm);
    });

    /** Click on approve */
    await waitFor(async () => {
      const approve = screen.getByText('Approve');
      expect(approve).toBeInTheDocument();
      fireEvent.click(approve);
    });

    /** Unlock after approve */
    await waitFor(async () => {
      screen.findAllByText('Confirm Transaction');
      const input = await screen.findByLabelText('Your Password');
      fireEvent.input(input, { target: { value: '123123123' } });
      const confirmUnlock = screen.getByText('Confirm Transaction');
      fireEvent.click(confirmUnlock);
    });

    /** See transaction success msg */
    await waitFor(async () => {
      expect(screen.getByText('Transaction sent')).toBeInTheDocument();
    });
  });
});
