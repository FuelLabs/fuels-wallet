import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { fireEvent } from '@storybook/testing-library';
import { Address } from 'fuels';
import { Pages, TestWrapper, shortAddress } from '~/systems/Core';

import { MOCK_TRANSACTION_CONTRACT_CALL } from '../../__mocks__/tx';

import { act } from 'react';
import { ActivityItem } from './ActivityItem';

const ownerAddress =
  MOCK_TRANSACTION_CONTRACT_CALL.operations[0].from?.address || '';

const opts = {
  route: Pages.txs(),
  wrapper: TestWrapper,
};

describe('TxItem', () => {
  it('a11y', async () => {
    await testA11y(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL}
        ownerAddress={ownerAddress}
      />,
      opts
    );
  });

  it('a11y Loader', async () => {
    await testA11y(<ActivityItem.Loader />);
  });

  it('should copy transaction id', async () => {
    render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL}
        ownerAddress={ownerAddress}
      />,
      opts
    );

    const btn = await screen.findByLabelText(/Copy Transaction ID/i);
    expect(btn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btn);
      expect(await navigator.clipboard.readText()).toBe(
        MOCK_TRANSACTION_CONTRACT_CALL.id
      );
    });
  });

  it('should display the right from / to address', async () => {
    render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL}
        ownerAddress={ownerAddress}
      />,
      opts
    );
    const address = MOCK_TRANSACTION_CONTRACT_CALL.operations[0].to?.address;
    if (address) {
      const addressB256 = Address.fromString(address ?? '').toB256();
      const to = await screen.findByText(shortAddress(addressB256));
      expect(to).toBeInTheDocument();

      const label = await screen.findByText(/To:/i);
      expect(label).toBeInTheDocument();
    }
  });

  it('should not display the right from / to label if owner address is empty', async () => {
    render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL}
        ownerAddress={''}
      />,
      opts
    );
    const address = MOCK_TRANSACTION_CONTRACT_CALL.operations[0].to?.address;
    if (address) {
      const to = screen.queryByText(shortAddress(address));
      expect(to).not.toBeInTheDocument();

      const label = screen.queryByText(/To:/i);
      expect(label).not.toBeInTheDocument();
    }
  });
});
