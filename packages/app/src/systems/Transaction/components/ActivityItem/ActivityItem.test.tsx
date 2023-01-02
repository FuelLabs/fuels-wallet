import { render, testA11y, screen } from '@fuel-ui/test-utils';

import { MOCK_TRANSACTION_CONTRACT_CALL } from '../../__mocks__/tx';

import { ActivityItem } from './ActivityItem';

import { shortAddress } from '~/systems/Core';

const ownerAddress =
  MOCK_TRANSACTION_CONTRACT_CALL.tx.operations[0].from?.address || '';

describe('TxItem', () => {
  it('a11y', async () => {
    await testA11y(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
    );
  });

  it('a11y Loader', async () => {
    await testA11y(<ActivityItem.Loader />);
  });

  it('should copy transaction id', async () => {
    const { user } = render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
    );

    const btn = await screen.findByLabelText(/Copy Transaction ID/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(
      MOCK_TRANSACTION_CONTRACT_CALL.tx.id
    );
  });

  it('should display the right from / to address', async () => {
    render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
    );
    const address = MOCK_TRANSACTION_CONTRACT_CALL.tx.operations[0].to?.address;
    if (address) {
      const to = await screen.findByText(shortAddress(address));
      expect(to).toBeInTheDocument();

      const label = await screen.findByText(/To/i);
      expect(label).toBeInTheDocument();
    }
  });

  it('should not display the right from / to label if owner address is empty', async () => {
    render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={''}
      />
    );
    const address = MOCK_TRANSACTION_CONTRACT_CALL.tx.operations[0].to?.address;
    if (address) {
      const to = await screen.queryByText(shortAddress(address));
      expect(to).not.toBeInTheDocument();

      const label = await screen.queryByText(/To/i);
      expect(label).not.toBeInTheDocument();
    }
  });
});
