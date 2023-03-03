import { fireEvent, render, screen, waitFor } from '@fuel-ui/test-utils';

import { Select } from './Send.stories';

import { TestWrapper } from '~/systems/Core';

describe('Send', () => {
  function findAssetSelect() {
    return screen.findByLabelText('Select Asset');
  }

  describe('Send.Select()', () => {
    it('should have all inputs rendered by default', async () => {
      render(<Select />, { wrapper: TestWrapper });
      expect(await findAssetSelect()).toBeInTheDocument();
      expect(await screen.findByLabelText('Address Input')).toBeInTheDocument();
      expect(await screen.findByLabelText('amount')).toBeInTheDocument();
    });

    it('should validate address', async () => {
      render(<Select />, { wrapper: TestWrapper });
      await waitFor(() => findAssetSelect());

      const input = await screen.findByLabelText('Address Input');
      fireEvent.input(input, { target: { value: 'wrong address' } });
      expect(
        await screen.findByText('Invalid bech32 address')
      ).toBeInTheDocument();
    });

    it('should show transaction details by default', async () => {
      render(<Select />, { wrapper: TestWrapper });
      await waitFor(() => findAssetSelect());
      expect(await screen.findByText('Fee (network)')).toBeInTheDocument();
    });
  });
});
